"use client";

import { useState } from "react";
import useSWR from "swr";
import { equiposApi, componentesApi, hojasVidaApi } from "@/lib/api";
import type { Equipo } from "@/lib/types";
import {
  X,
  Monitor,
  Cpu,
  HardDrive,
  Calendar,
  MapPin,
  Truck,
  FileText,
  Plus,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EquipoDetailModalProps {
  equipoId: number;
  onClose: () => void;
}

const componenteIcons: Record<string, React.ReactNode> = {
  disco_duro: <HardDrive className="w-4 h-4" />,
  memoria_ram: <Cpu className="w-4 h-4" />,
  procesador: <Cpu className="w-4 h-4" />,
  tarjeta_madre: <Monitor className="w-4 h-4" />,
  fuente_poder: <Monitor className="w-4 h-4" />,
  tarjeta_video: <Monitor className="w-4 h-4" />,
};

const tipoMovimientoLabels: Record<string, { label: string; color: string }> = {
  ingreso: { label: "Ingreso", color: "text-green-500" },
  salida: { label: "Salida", color: "text-blue-500" },
  baja: { label: "Baja", color: "text-red-500" },
  mantenimiento: { label: "Mantenimiento", color: "text-yellow-500" },
  repuesto: { label: "Repuesto", color: "text-orange-500" },
  componente_agregado: { label: "Componente Agregado", color: "text-purple-500" },
  activo: { label: "Activación", color: "text-green-500" },
  inactivo: { label: "Desactivación", color: "text-gray-500" },
};

export default function EquipoDetailModal({
  equipoId,
  onClose,
}: EquipoDetailModalProps) {
  const { data: equipo, mutate } = useSWR<Equipo>(
    `equipo-${equipoId}`,
    () => equiposApi.getOne(equipoId)
  );
  
  const [activeTab, setActiveTab] = useState("info");
  const [showAddMovimiento, setShowAddMovimiento] = useState(false);
  const [movimientoForm, setMovimientoForm] = useState({
    tipo_movimiento: "mantenimiento",
    descripcion: "",
    responsable: "",
    observaciones: "",
  });

  const handleAddMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    await hojasVidaApi.create(equipoId, movimientoForm);
    mutate();
    setShowAddMovimiento(false);
    setMovimientoForm({
      tipo_movimiento: "mantenimiento",
      descripcion: "",
      responsable: "",
      observaciones: "",
    });
  };

  if (!equipo) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] bg-opacity-20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{equipo.nombre}</h3>
              <p className="text-sm text-[var(--muted-foreground)] font-mono">
                {equipo.serial}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Información
            </button>
            <button
              className={`tab ${activeTab === "componentes" ? "active" : ""}`}
              onClick={() => setActiveTab("componentes")}
            >
              Componentes ({equipo.componentes?.length || 0})
            </button>
            <button
              className={`tab ${activeTab === "historial" ? "active" : ""}`}
              onClick={() => setActiveTab("historial")}
            >
              Hoja de Vida ({equipo.hojas_vida?.length || 0})
            </button>
          </div>
        </div>

        <div className="modal-body">
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Tipo</p>
                    <p className="font-medium capitalize">{equipo.tipo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Marca / Modelo
                    </p>
                    <p className="font-medium">
                      {equipo.marca || "-"} {equipo.modelo}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Ubicación
                    </p>
                    <p className="font-medium">{equipo.ubicacion || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Proveedor
                    </p>
                    <p className="font-medium">{equipo.proveedor_nombre || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Fecha de Compra
                    </p>
                    <p className="font-medium">
                      {equipo.fecha_compra
                        ? format(new Date(equipo.fecha_compra), "dd MMM yyyy", {
                            locale: es,
                          })
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[var(--muted-foreground)] mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Fin de Garantía
                    </p>
                    <p className="font-medium">
                      {equipo.fecha_garantia
                        ? format(new Date(equipo.fecha_garantia), "dd MMM yyyy", {
                            locale: es,
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {equipo.valor && (
                <div className="p-4 bg-[var(--secondary)] rounded-lg">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Valor del equipo
                  </p>
                  <p className="text-2xl font-bold">
                    ${equipo.valor.toLocaleString()}
                  </p>
                </div>
              )}

              {equipo.observaciones && (
                <div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">
                    Observaciones
                  </p>
                  <p className="p-3 bg-[var(--secondary)] rounded-lg text-sm">
                    {equipo.observaciones}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "componentes" && (
            <div className="space-y-3">
              {equipo.componentes && equipo.componentes.length > 0 ? (
                equipo.componentes.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center gap-4 p-4 bg-[var(--secondary)] rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)] bg-opacity-20 flex items-center justify-center">
                      {componenteIcons[comp.tipo] || (
                        <Cpu className="w-5 h-5 text-[var(--primary)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium capitalize">
                        {comp.tipo.replace("_", " ")}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {comp.marca} {comp.modelo} {comp.capacidad && `- ${comp.capacidad}`}
                      </p>
                      {comp.serial && (
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          S/N: {comp.serial}
                        </p>
                      )}
                    </div>
                    <span
                      className={`badge ${
                        comp.estado === "bueno"
                          ? "badge-success"
                          : comp.estado === "regular"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {comp.estado}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--muted-foreground)]">
                  <Cpu className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay componentes registrados</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "historial" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Historial de movimientos y cambios
                </p>
                <button
                  onClick={() => setShowAddMovimiento(!showAddMovimiento)}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Registro
                </button>
              </div>

              {showAddMovimiento && (
                <form
                  onSubmit={handleAddMovimiento}
                  className="p-4 bg-[var(--secondary)] rounded-lg space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={movimientoForm.tipo_movimiento}
                      onChange={(e) =>
                        setMovimientoForm({
                          ...movimientoForm,
                          tipo_movimiento: e.target.value,
                        })
                      }
                      className="w-full"
                    >
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="reparacion">Reparación</option>
                      <option value="actualizacion">Actualización</option>
                      <option value="revision">Revisión</option>
                      <option value="otro">Otro</option>
                    </select>
                    <input
                      type="text"
                      value={movimientoForm.responsable}
                      onChange={(e) =>
                        setMovimientoForm({
                          ...movimientoForm,
                          responsable: e.target.value,
                        })
                      }
                      className="w-full"
                      placeholder="Responsable"
                    />
                  </div>
                  <input
                    type="text"
                    value={movimientoForm.descripcion}
                    onChange={(e) =>
                      setMovimientoForm({
                        ...movimientoForm,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full"
                    placeholder="Descripción del movimiento"
                  />
                  <textarea
                    value={movimientoForm.observaciones}
                    onChange={(e) =>
                      setMovimientoForm({
                        ...movimientoForm,
                        observaciones: e.target.value,
                      })
                    }
                    className="w-full"
                    rows={2}
                    placeholder="Observaciones adicionales..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMovimiento(false)}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-0">
                {equipo.hojas_vida && equipo.hojas_vida.length > 0 ? (
                  equipo.hojas_vida.map((hoja) => {
                    const movInfo = tipoMovimientoLabels[hoja.tipo_movimiento] || {
                      label: hoja.tipo_movimiento,
                      color: "text-gray-500",
                    };
                    return (
                      <div key={hoja.id} className="timeline-item">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${movInfo.color}`}>
                              {movInfo.label}
                            </span>
                            {hoja.responsable && (
                              <span className="text-sm text-[var(--muted-foreground)]">
                                por {hoja.responsable}
                              </span>
                            )}
                          </div>
                          {hoja.descripcion && (
                            <p className="text-sm">{hoja.descripcion}</p>
                          )}
                          {hoja.observaciones && (
                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                              {hoja.observaciones}
                            </p>
                          )}
                          <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(hoja.fecha), "dd MMM yyyy, HH:mm", {
                              locale: es,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-[var(--muted-foreground)]">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay registros en la hoja de vida</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
