import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente, Vehiculo, VehiculoRequest } from '../models/vehiculo.model';

@Injectable({ providedIn: 'root' })
export class VehiculoApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/vehiculos`;
  private readonly clientesUrl = `${environment.apiUrl}/clientes`;
  listar(clienteId?: number): Observable<Vehiculo[]> {
    const params = clienteId ? new HttpParams().set('clienteId', clienteId) : undefined;
    return this.http.get<Vehiculo[]>(this.url, { params });
  }
  obtener(id: number): Observable<Vehiculo> { return this.http.get<Vehiculo>(`${this.url}/${id}`); }
  crear(request: VehiculoRequest): Observable<Vehiculo> { return this.http.post<Vehiculo>(this.url, request); }
  actualizar(id: number, request: VehiculoRequest): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.url}/${id}`, request);
  }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  listarClientes(): Observable<Cliente[]> { return this.http.get<Cliente[]>(this.clientesUrl); }
}
