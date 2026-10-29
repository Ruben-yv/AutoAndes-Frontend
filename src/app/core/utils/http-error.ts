import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response';

export function mensajeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar con AutoAndes API. Comprueba que el backend esté iniciado y que CORS permita http://localhost:4200.';
  }
  const body = error.error as ErrorResponse | null;
  return body?.mensaje ?? `Error ${error.status}: ${error.statusText}`;
}

export function erroresDeValidacion(error: HttpErrorResponse): Record<string, string> {
  const body = error.error as ErrorResponse | null;
  return body?.campos ?? {};
}
