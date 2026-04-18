export interface Proveedor {
  id: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  created_at: string;
}

export interface Componente {
  id: number;
  equipo_id: number;
  tipo: string;
  marca?: string;
  modelo?: string;
  serial?: string;
  capacidad?: string;
  especificaciones?: string;
  estado: string;
}

export interface HojaVida {
  id: number;
  equipo_id: number;
  tipo_movimiento: string;
  descripcion?: string;
  responsable?: string;
  fecha: string;
  observaciones?: string;
  equipo_nombre?: string;
}

export interface Equipo {
  id: number;
  nombre: string;
  tipo: string;
  marca?: string;
  modelo?: string;
  serial: string;
  estado: string;
  ubicacion?: string;
  proveedor_id?: number;
  proveedor_nombre?: string;
  fecha_compra?: string;
  fecha_garantia?: string;
  valor?: number;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  componentes?: Componente[];
  hojas_vida?: HojaVida[];
}

export interface Estadisticas {
  total_equipos: number;
  equipos_activos: number;
  equipos_baja: number;
  equipos_mantenimiento: number;
  equipos_repuesto: number;
  total_proveedores: number;
  por_tipo: { tipo: string; cantidad: number }[];
  ultimos_movimientos: HojaVida[];
}

export type EstadoEquipo = 'activo' | 'inactivo' | 'mantenimiento' | 'baja' | 'repuesto' | 'salida';

export type TipoEquipo = 'desktop' | 'laptop' | 'servidor' | 'impresora' | 'monitor' | 'red' | 'otro';

export type TipoComponente = 'disco_duro' | 'memoria_ram' | 'procesador' | 'tarjeta_madre' | 'fuente_poder' | 'tarjeta_video' | 'otro';
