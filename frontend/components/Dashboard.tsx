"use client";

import useSWR from "swr";
import { estadisticasApi } from "@/lib/api";
import type { Estadisticas } from "@/lib/types";
import {
  Monitor,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Wrench,
  Truck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const estadoIcons: Record<string, React.ReactNode> = {
  ingreso: <CheckCircle className="w-4 h-4 text-green-500" />,
  salida: <ArrowRight className="w-4 h-4 text-blue-500" />,
  baja: <XCircle className="w-4 h-4 text-red-500" />,
  mantenimiento: <Wrench className="w-4 h-4 text-yellow-500" />,
  repuesto: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  componente_agregado: <Monitor className="w-4 h-4 text-purple-500" />,
};

export default function Dashboard() {
  const { data: stats, isLoading } = useSWR<Estadisticas>(
    "estadisticas",
    estadisticasApi.get
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-[var(--muted-foreground)]">
          Resumen general del inventario de equipos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">
                Total Equipos
              </p>
              <p className="text-3xl font-bold">{stats?.total_equipos || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[var(--primary)] bg-opacity-20 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-[var(--primary)]" />
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">
                Activos
              </p>
              <p className="text-3xl font-bold text-green-500">
                {stats?.equipos_activos || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">
                En Mantenimiento
              </p>
              <p className="text-3xl font-bold text-yellow-500">
                {stats?.equipos_mantenimiento || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500 bg-opacity-20 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">
                Dados de Baja
              </p>
              <p className="text-3xl font-bold text-red-500">
                {stats?.equipos_baja || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500 bg-opacity-20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500 bg-opacity-20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Repuestos
              </p>
              <p className="text-xl font-bold">{stats?.equipos_repuesto || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] bg-opacity-20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Proveedores
              </p>
              <p className="text-xl font-bold">
                {stats?.total_proveedores || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Tipos de Equipos
              </p>
              <p className="text-xl font-bold">{stats?.por_tipo?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipos por Tipo */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[var(--primary)]" />
            Equipos por Tipo
          </h3>
          {stats?.por_tipo && stats.por_tipo.length > 0 ? (
            <div className="space-y-3">
              {stats.por_tipo.map((item) => (
                <div key={item.tipo} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {item.tipo}
                      </span>
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {item.cantidad}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all"
                        style={{
                          width: `${
                            (item.cantidad / (stats.total_equipos || 1)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted-foreground)] text-sm">
              No hay equipos registrados
            </p>
          )}
        </div>

        {/* Últimos Movimientos */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            Últimos Movimientos
          </h3>
          {stats?.ultimos_movimientos && stats.ultimos_movimientos.length > 0 ? (
            <div className="space-y-0">
              {stats.ultimos_movimientos.slice(0, 5).map((mov) => (
                <div key={mov.id} className="timeline-item">
                  <div className="flex items-start gap-3">
                    {estadoIcons[mov.tipo_movimiento] || (
                      <Clock className="w-4 h-4 text-gray-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {mov.equipo_nombre}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {mov.descripcion || mov.tipo_movimiento}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {format(new Date(mov.fecha), "dd MMM yyyy, HH:mm", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted-foreground)] text-sm">
              No hay movimientos registrados
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
