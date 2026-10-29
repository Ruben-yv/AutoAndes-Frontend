export interface Cliente {
  id: number;
  documento: string;
  nombres: string;
  telefono: string | null;
}

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  clienteId: number;
  clienteNombre: string;
}

export interface VehiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  clienteId: number;
}
