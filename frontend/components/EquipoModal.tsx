"use client";

import { useState } from "react";
import { equiposApi } from "@/lib/api";
import type { Equipo, Proveedor, Componente } from "@/lib/types";
import { X, Plus, Trash2 } from "lucide-react";

interface EquipoModalProps {
  equipo: Equipo | null;
  proveedores: Proveedor[];
  onClose: () => void;
  onSave: () => void;
}

interface ComponenteForm {
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
  capacidad: string;
  especificaciones: string;
  estado: string;
}

export default function EquipoModal({
  equipo,
  proveedores,
  onClose,
  onSave,
}: EquipoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  
  const [formData, setFormData] = useState({
    nombre: equipo?.nombre || "",
    tipo: equipo?.tipo || "desktop",
    marca: equipo?.marca || "",
    modelo: equipo?.modelo || "",
    serial: equipo?.serial || "",
    estado: equipo?.estado || "activo",
    ubicacion: equipo?.ubicacion || "",
    proveedor_id: equipo?.proveedor_id?.toString() || "",
    fecha_compra: equipo?.fecha_compra || "",
    fecha_garantia: equipo?.fecha_garantia || "",
    valor: equipo?.valor?.toString() || "",
    observaciones: equipo?.observaciones || "",
    responsable: "",
  });

  const [componentes, setComponentes] = useState<ComponenteForm[]>(
    equipo?.componentes?.map((c) => ({
      tipo: c.tipo,
      marca: c.marca || "",
      modelo: c.modelo || "",
      serial: c.serial || "",
      capacidad: c.capacidad || "",
      especificaciones: c.especificaciones || "",
      estado: c.estado,
    })) || []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addComponente = () => {
    setComponentes([
      ...componentes,
      {
        tipo: "disco_duro",
        marca: "",
        modelo: "",
        serial: "",
        capacidad: "",
        especificaciones: "",
        estado: "bueno",
      },
    ]);
  };

  const updateComponente = (index: number, field: string, value: string) => {
    const updated = [...componentes];
    updated[index] = { ...updated[index], [field]: value };
    setComponentes(updated);
  };

  const removeComponente = (index: number) => {
    setComponentes(componentes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        ...formData,
        proveedor_id: formData.proveedor_id ? parseInt(formData.proveedor_id) : null,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        componentes: componentes.filter((c) => c.tipo),
      };

      if (equipo) {
        await equiposApi.update(equipo.id, data);
      } else {
        await equiposApi.create(data);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold">
            {equipo ? "Editar Equipo" : "Nuevo Equipo"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="px-6 pt-4">
            <div className="tabs">
              <button
                type="button"
                className={`tab ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                type="button"
                className={`tab ${activeTab === "componentes" ? "active" : ""}`}
                onClick={() => setActiveTab("componentes")}
              >
                Componentes ({componentes.length})
              </button>
            </div>
          </div>

          <div className="modal-body">
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Nombre del Equipo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Ej: PC Contabilidad 01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Serial *
                  </label>
                  <input
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    required
                    className="w-full font-mono"
                    placeholder="Ej: SN123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Tipo de Equipo *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="w-full"
                  >
                    <option value="desktop">Desktop</option>
                    <option value="laptop">Laptop</option>
                    <option value="servidor">Servidor</option>
                    <option value="impresora">Impresora</option>
                    <option value="monitor">Monitor</option>
                    <option value="red">Equipo de Red</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="mantenimiento">En Mantenimiento</option>
                    <option value="baja">Dado de Baja</option>
                    <option value="repuesto">Repuesto</option>
                    <option value="salida">Salida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Ej: Dell, HP, Lenovo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Ej: OptiPlex 7090"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Ej: Oficina 201"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Proveedor
                  </label>
                  <select
                    name="proveedor_id"
                    value={formData.proveedor_id}
                    onChange={handleChange}
                    className="w-full"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Fecha de Compra
                  </label>
                  <input
                    type="date"
                    name="fecha_compra"
                    value={formData.fecha_compra}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Fecha Fin Garantía
                  </label>
                  <input
                    type="date"
                    name="fecha_garantia"
                    value={formData.fecha_garantia}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Valor ($)
                  </label>
                  <input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Responsable
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    className="w-full"
                    rows={3}
                    placeholder="Notas adicionales sobre el equipo..."
                  />
                </div>
              </div>
            )}

            {activeTab === "componentes" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Agrega los componentes internos del equipo (disco duro, RAM,
                    etc.)
                  </p>
                  <button
                    type="button"
                    onClick={addComponente}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>

                {componentes.length === 0 ? (
                  <div className="text-center py-8 text-[var(--muted-foreground)]">
                    <p>No hay componentes agregados</p>
                    <button
                      type="button"
                      onClick={addComponente}
                      className="btn btn-primary mt-3"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar componente
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {componentes.map((comp, index) => (
                      <div
                        key={index}
                        className="p-4 bg-[var(--secondary)] rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Componente {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeComponente(index)}
                            className="p-1 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={comp.tipo}
                            onChange={(e) =>
                              updateComponente(index, "tipo", e.target.value)
                            }
                            className="w-full"
                          >
                            <option value="disco_duro">Disco Duro</option>
                            <option value="memoria_ram">Memoria RAM</option>
                            <option value="procesador">Procesador</option>
                            <option value="tarjeta_madre">Tarjeta Madre</option>
                            <option value="fuente_poder">Fuente de Poder</option>
                            <option value="tarjeta_video">Tarjeta de Video</option>
                            <option value="otro">Otro</option>
                          </select>

                          <input
                            type="text"
                            value={comp.marca}
                            onChange={(e) =>
                              updateComponente(index, "marca", e.target.value)
                            }
                            className="w-full"
                            placeholder="Marca"
                          />

                          <input
                            type="text"
                            value={comp.serial}
                            onChange={(e) =>
                              updateComponente(index, "serial", e.target.value)
                            }
                            className="w-full font-mono"
                            placeholder="Serial"
                          />

                          <input
                            type="text"
                            value={comp.capacidad}
                            onChange={(e) =>
                              updateComponente(index, "capacidad", e.target.value)
                            }
                            className="w-full"
                            placeholder="Capacidad (ej: 8GB, 500GB)"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : equipo ? "Actualizar" : "Crear Equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
