"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface BackendStatus {
  status: string;
  database: string;
  total_equipos: number;
  total_proveedores: number;
}

export default function ConfigPanel() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const checkBackendStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        const data = await response.json();
        setBackendStatus(data);
      } else {
        setBackendStatus(null);
      }
    } catch {
      setBackendStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const exportData = async () => {
    try {
      const [equiposRes, proveedoresRes] = await Promise.all([
        fetch("/api/equipos"),
        fetch("/api/proveedores"),
      ]);

      const equipos = await equiposRes.json();
      const proveedores = await proveedoresRes.json();

      const exportData = {
        fecha_exportacion: new Date().toISOString(),
        equipos,
        proveedores,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventario_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "Datos exportados correctamente" });
    } catch {
      setMessage({ type: "error", text: "Error al exportar los datos" });
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.proveedores) {
        for (const proveedor of data.proveedores) {
          await fetch("/api/proveedores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: proveedor.nombre,
              contacto: proveedor.contacto,
              telefono: proveedor.telefono,
              email: proveedor.email,
              direccion: proveedor.direccion,
            }),
          });
        }
      }

      if (data.equipos) {
        for (const equipo of data.equipos) {
          await fetch("/api/equipos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: equipo.nombre,
              tipo: equipo.tipo,
              marca: equipo.marca,
              modelo: equipo.modelo,
              serial: equipo.serial,
              estado: equipo.estado || "activo",
              ubicacion: equipo.ubicacion,
              fecha_compra: equipo.fecha_compra,
              garantia_hasta: equipo.garantia_hasta,
              valor: equipo.valor,
              proveedor_id: equipo.proveedor_id,
              notas: equipo.notas,
              componentes: equipo.componentes || [],
            }),
          });
        }
      }

      setMessage({ type: "success", text: "Datos importados correctamente" });
      checkBackendStatus();
    } catch {
      setMessage({ type: "error", text: "Error al importar los datos. Verifica el formato del archivo." });
    }

    event.target.value = "";
  };

  const resetDatabase = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    try {
      const equiposRes = await fetch("/api/equipos");
      const equipos = await equiposRes.json();
      
      for (const equipo of equipos) {
        await fetch(`/api/equipos/${equipo.id}`, { method: "DELETE" });
      }

      const proveedoresRes = await fetch("/api/proveedores");
      const proveedores = await proveedoresRes.json();
      
      for (const proveedor of proveedores) {
        await fetch(`/api/proveedores/${proveedor.id}`, { method: "DELETE" });
      }

      setMessage({ type: "success", text: "Base de datos reiniciada correctamente" });
      setConfirmReset(false);
      checkBackendStatus();
    } catch {
      setMessage({ type: "error", text: "Error al reiniciar la base de datos" });
      setConfirmReset(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuracion</h2>
        <p className="text-[var(--muted-foreground)] mt-1">
          Administra la configuracion del sistema y la base de datos
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-auto text-current opacity-70 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado del Sistema */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="w-5 h-5 text-[var(--primary)]" />
              Estado del Sistema
            </h3>
            <button
              onClick={checkBackendStatus}
              className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              title="Actualizar estado"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
            </div>
          ) : backendStatus ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-green-400">Backend conectado</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--secondary)] rounded-lg p-4">
                  <p className="text-sm text-[var(--muted-foreground)]">Base de datos</p>
                  <p className="font-medium">{backendStatus.database}</p>
                </div>
                <div className="bg-[var(--secondary)] rounded-lg p-4">
                  <p className="text-sm text-[var(--muted-foreground)]">Equipos</p>
                  <p className="font-medium">{backendStatus.total_equipos}</p>
                </div>
                <div className="bg-[var(--secondary)] rounded-lg p-4">
                  <p className="text-sm text-[var(--muted-foreground)]">Proveedores</p>
                  <p className="font-medium">{backendStatus.total_proveedores}</p>
                </div>
                <div className="bg-[var(--secondary)] rounded-lg p-4">
                  <p className="text-sm text-[var(--muted-foreground)]">Estado</p>
                  <p className="font-medium capitalize">{backendStatus.status}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>No se pudo conectar al backend</span>
            </div>
          )}
        </div>

        {/* Respaldo y Restauracion */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Download className="w-5 h-5 text-[var(--primary)]" />
            Respaldo y Restauracion
          </h3>

          <div className="space-y-4">
            <div className="bg-[var(--secondary)] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--muted-foreground)]">
                  Exporta todos los datos del inventario a un archivo JSON para respaldo, 
                  o importa datos desde un archivo previamente exportado.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={exportData}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                Exportar datos (JSON)
              </button>

              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--secondary)] text-[var(--foreground)] rounded-lg hover:bg-[var(--secondary)]/80 transition-colors cursor-pointer">
                <Upload className="w-5 h-5" />
                Importar datos
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="lg:col-span-2 bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4 text-red-400">
            <Trash2 className="w-5 h-5" />
            Zona de Peligro
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium">Reiniciar base de datos</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Elimina todos los equipos y proveedores. Esta accion no se puede deshacer.
              </p>
            </div>
            
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={resetDatabase}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Confirmar eliminacion
                </button>
              </div>
            ) : (
              <button
                onClick={resetDatabase}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Reiniciar base de datos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
