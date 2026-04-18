"use client";

import { useState } from "react";
import useSWR from "swr";
import { equiposApi, proveedoresApi } from "@/lib/api";
import type { Equipo, Proveedor } from "@/lib/types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Monitor,
  Laptop,
  Server,
  Printer,
  Tv,
  Wifi,
  Box,
} from "lucide-react";
import EquipoModal from "./EquipoModal";
import EquipoDetailModal from "./EquipoDetailModal";
import EstadoModal from "./EstadoModal";

const tipoIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="w-4 h-4" />,
  laptop: <Laptop className="w-4 h-4" />,
  servidor: <Server className="w-4 h-4" />,
  impresora: <Printer className="w-4 h-4" />,
  monitor: <Tv className="w-4 h-4" />,
  red: <Wifi className="w-4 h-4" />,
  otro: <Box className="w-4 h-4" />,
};

const estadoBadges: Record<string, string> = {
  activo: "badge-success",
  inactivo: "badge-secondary",
  mantenimiento: "badge-warning",
  baja: "badge-danger",
  repuesto: "badge-info",
  salida: "badge-info",
};

export default function EquiposList() {
  const { data: equipos, mutate } = useSWR<Equipo[]>("equipos", equiposApi.getAll);
  const { data: proveedores } = useSWR<Proveedor[]>("proveedores", proveedoresApi.getAll);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);

  const filteredEquipos = equipos?.filter((equipo) => {
    const matchesSearch =
      equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.marca?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || equipo.estado === filterEstado;
    const matchesTipo = !filterTipo || equipo.tipo === filterTipo;
    return matchesSearch && matchesEstado && matchesTipo;
  });

  const handleEdit = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setShowModal(true);
  };

  const handleView = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setShowDetailModal(true);
  };

  const handleEstado = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setShowEstadoModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este equipo?")) {
      await equiposApi.delete(id);
      mutate();
    }
  };

  const handleSave = () => {
    mutate();
    setShowModal(false);
    setSelectedEquipo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Equipos</h2>
          <p className="text-[var(--muted-foreground)]">
            Gestiona el inventario de equipos de cómputo
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEquipo(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Buscar por nombre, serial o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="baja">Dado de Baja</option>
            <option value="repuesto">Repuesto</option>
            <option value="salida">Salida</option>
          </select>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="w-full"
          >
            <option value="">Todos los tipos</option>
            <option value="desktop">Desktop</option>
            <option value="laptop">Laptop</option>
            <option value="servidor">Servidor</option>
            <option value="impresora">Impresora</option>
            <option value="monitor">Monitor</option>
            <option value="red">Red</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Serial</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipos?.map((equipo) => (
              <tr key={equipo.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] flex items-center justify-center">
                      {tipoIcons[equipo.tipo] || <Box className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{equipo.nombre}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {equipo.marca} {equipo.modelo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="font-mono text-sm">{equipo.serial}</td>
                <td className="capitalize">{equipo.tipo}</td>
                <td>{equipo.ubicacion || "-"}</td>
                <td>{equipo.proveedor_nombre || "-"}</td>
                <td>
                  <button
                    onClick={() => handleEstado(equipo)}
                    className={`badge ${estadoBadges[equipo.estado] || "badge-secondary"} cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    {equipo.estado}
                  </button>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleView(equipo)}
                      className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(equipo)}
                      className="p-2 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(equipo.id)}
                      className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 text-[var(--muted-foreground)] hover:text-red-500 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!filteredEquipos || filteredEquipos.length === 0) && (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className="w-12 h-12 text-[var(--muted-foreground)]" />
                    <p className="text-[var(--muted-foreground)]">
                      No se encontraron equipos
                    </p>
                    <button
                      onClick={() => {
                        setSelectedEquipo(null);
                        setShowModal(true);
                      }}
                      className="btn btn-primary mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar primer equipo
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showModal && (
        <EquipoModal
          equipo={selectedEquipo}
          proveedores={proveedores || []}
          onClose={() => {
            setShowModal(false);
            setSelectedEquipo(null);
          }}
          onSave={handleSave}
        />
      )}

      {showDetailModal && selectedEquipo && (
        <EquipoDetailModal
          equipoId={selectedEquipo.id}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEquipo(null);
          }}
        />
      )}

      {showEstadoModal && selectedEquipo && (
        <EstadoModal
          equipo={selectedEquipo}
          onClose={() => {
            setShowEstadoModal(false);
            setSelectedEquipo(null);
          }}
          onSave={() => {
            mutate();
            setShowEstadoModal(false);
            setSelectedEquipo(null);
          }}
        />
      )}
    </div>
  );
}
