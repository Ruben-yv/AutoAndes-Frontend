import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Servicio, ServicioRequest } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/servicios`;
  listar(): Observable<Servicio[]> { return this.http.get<Servicio[]>(this.url); }
  obtener(id: number): Observable<Servicio> { return this.http.get<Servicio>(`${this.url}/${id}`); }
  crear(request: ServicioRequest): Observable<Servicio> { return this.http.post<Servicio>(this.url, request); }
  actualizar(id: number, request: ServicioRequest): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.url}/${id}`, request);
  }
  darDeBaja(id: number): Observable<Servicio> { return this.http.patch<Servicio>(`${this.url}/${id}/estado`, {}); }
}
