export type EstadoOrden = 'REGISTRADA' | 'ANULADA';
export interface DetalleOrdenRequest { servicioId: number; cantidad: number; }
export interface OrdenRequest { vehiculoId: number; kilometraje: number; detalles: DetalleOrdenRequest[]; }
export interface DetalleOrden {
  id: number;
  servicioId: number;
  servicioCodigo: string;
  servicioNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
export interface OrdenServicio {
  id: number;
  numero: string;
  fecha: string;
  vehiculoId: number;
  placa: string;
  kilometraje: number;
  estado: EstadoOrden;
  total: number;
  usuarioRegistro: string;
  motivoAnulacion: string | null;
  detalles: DetalleOrden[];
}
export interface FiltrosOrden { placa?: string; estado?: EstadoOrden | ''; desde?: string; hasta?: string; }
