"use client";

import { useState } from "react";
import useSWR from "swr";
import { proveedoresApi } from "@/lib/api";
import type { Proveedor } from "@/lib/types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Truck,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

export default function ProveedoresList() {
  const { data: proveedores, mutate } = useSWR<Proveedor[]>(
    "proveedores",
    proveedoresApi.getAll
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);

  const filteredProveedores = proveedores?.filter((proveedor) =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este proveedor?")) {
      await proveedoresApi.delete(id);
      mutate();
    }
  };

  const handleSave = () => {
    mutate();
    setShowModal(false);
    setSelectedProveedor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Proveedores</h2>
          <p className="text-[var(--muted-foreground)]">
            Gestiona los proveedores de equipos
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedProveedor(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProveedores?.map((proveedor) => (
          <div key={proveedor.id} className="card hover:border-[var(--primary)] transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)] bg-opacity-20 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold">{proveedor.nombre}</h3>
                  {proveedor.contacto && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {proveedor.contacto}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(proveedor)}
                  className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(proveedor.id)}
                  className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 text-[var(--muted-foreground)] hover:text-red-500 transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {proveedor.telefono && (
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Phone className="w-4 h-4" />
                  <span>{proveedor.telefono}</span>
                </div>
              )}
              {proveedor.email && (
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Mail className="w-4 h-4" />
                  <span>{proveedor.email}</span>
                </div>
              )}
              {proveedor.direccion && (
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{proveedor.direccion}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {(!filteredProveedores || filteredProveedores.length === 0) && (
          <div className="col-span-full text-center py-12">
            <Truck className="w-12 h-12 mx-auto mb-3 text-[var(--muted-foreground)]" />
            <p className="text-[var(--muted-foreground)] mb-4">
              No se encontraron proveedores
            </p>
            <button
              onClick={() => {
                setSelectedProveedor(null);
                setShowModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Agregar primer proveedor
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProveedorModal
          proveedor={selectedProveedor}
          onClose={() => {
            setShowModal(false);
            setSelectedProveedor(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Proveedor Modal Component
function ProveedorModal({
  proveedor,
  onClose,
  onSave,
}: {
  proveedor: Proveedor | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: proveedor?.nombre || "",
    contacto: proveedor?.contacto || "",
    telefono: proveedor?.telefono || "",
    email: proveedor?.email || "",
    direccion: proveedor?.direccion || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (proveedor) {
        await proveedoresApi.update(proveedor.id, formData);
      } else {
        await proveedoresApi.create(formData);
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
      <div className="modal max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold">
            {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body space-y-4">
            {error && (
              <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Nombre del Proveedor *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="Ej: Tech Solutions S.A."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Persona de Contacto
              </label>
              <input
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                className="w-full"
                placeholder="Nombre del contacto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full"
                placeholder="+57 300 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                placeholder="contacto@proveedor.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Dirección
              </label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full"
                rows={2}
                placeholder="Dirección completa"
              />
            </div>
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
              {loading ? "Guardando..." : proveedor ? "Actualizar" : "Crear Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
