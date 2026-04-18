"use client";

import { useState } from "react";
import { equiposApi } from "@/lib/api";
import type { Equipo } from "@/lib/types";
import { X, ArrowRight } from "lucide-react";

interface EstadoModalProps {
  equipo: Equipo;
  onClose: () => void;
  onSave: () => void;
}

const estados = [
  { value: "activo", label: "Activo", color: "bg-green-500", description: "El equipo está en uso normal" },
  { value: "inactivo", label: "Inactivo", color: "bg-gray-500", description: "El equipo no está siendo utilizado" },
  { value: "mantenimiento", label: "En Mantenimiento", color: "bg-yellow-500", description: "El equipo está en reparación o mantenimiento" },
  { value: "baja", label: "Dado de Baja", color: "bg-red-500", description: "El equipo fue retirado del inventario" },
  { value: "repuesto", label: "Repuesto", color: "bg-orange-500", description: "El equipo se usa para obtener partes" },
  { value: "salida", label: "Salida", color: "bg-blue-500", description: "El equipo fue transferido o prestado" },
];

export default function EstadoModal({ equipo, onClose, onSave }: EstadoModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(equipo.estado);
  const [formData, setFormData] = useState({
    descripcion: "",
    responsable: "",
    observaciones: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEstado === equipo.estado) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await equiposApi.cambiarEstado(equipo.id, {
        estado: selectedEstado,
        ...formData,
      });
      onSave();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold">Cambiar Estado</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[var(--secondary)] rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-[var(--muted-foreground)]">Equipo</p>
                <p className="font-medium">{equipo.nombre}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)]" />
              <div className="flex-1 text-right">
                <p className="text-sm text-[var(--muted-foreground)]">Estado actual</p>
                <p className="font-medium capitalize">{equipo.estado}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nuevo Estado
              </label>
              <div className="grid grid-cols-2 gap-2">
                {estados.map((estado) => (
                  <button
                    key={estado.value}
                    type="button"
                    onClick={() => setSelectedEstado(estado.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedEstado === estado.value
                        ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                        : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${estado.color}`} />
                      <span className="font-medium text-sm">{estado.label}</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {estado.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {selectedEstado !== equipo.estado && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Descripción del cambio
                  </label>
                  <input
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    className="w-full"
                    placeholder="Motivo del cambio de estado"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Responsable
                  </label>
                  <input
                    type="text"
                    value={formData.responsable}
                    onChange={(e) =>
                      setFormData({ ...formData, responsable: e.target.value })
                    }
                    className="w-full"
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({ ...formData, observaciones: e.target.value })
                    }
                    className="w-full"
                    rows={2}
                    placeholder="Notas adicionales..."
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || selectedEstado === equipo.estado}
            >
              {loading ? "Guardando..." : "Cambiar Estado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
