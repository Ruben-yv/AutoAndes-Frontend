import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FiltrosOrden, OrdenRequest, OrdenServicio } from '../models/orden.model';

@Injectable({ providedIn: 'root' })
export class OrdenApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/ordenes`;
  listar(filtros: FiltrosOrden = {}): Observable<OrdenServicio[]> {
    let params = new HttpParams();
    if (filtros.placa?.trim()) params = params.set('placa', filtros.placa.trim().toUpperCase());
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.desde) params = params.set('desde', filtros.desde);
    if (filtros.hasta) params = params.set('hasta', filtros.hasta);
    return this.http.get<OrdenServicio[]>(this.url, { params });
  }
  obtener(id: number): Observable<OrdenServicio> { return this.http.get<OrdenServicio>(`${this.url}/${id}`); }
  registrar(request: OrdenRequest): Observable<OrdenServicio> { return this.http.post<OrdenServicio>(this.url, request); }
  anular(id: number, motivo: string): Observable<OrdenServicio> {
    return this.http.patch<OrdenServicio>(`${this.url}/${id}/anular`, { motivo });
  }
}
