import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';

export const SERVICIO_ROUTES: Routes = [
  { path: '', title: 'Servicios', loadComponent: () => import('./pages/servicio-list/servicio-list').then(m => m.ServicioList) },
  { path: 'nuevo', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_ESCRIBIR' }, title: 'Nuevo servicio', loadComponent: () => import('./pages/servicio-form/servicio-form').then(m => m.ServicioForm) },
  { path: ':id/editar', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_ESCRIBIR' }, title: 'Editar servicio', loadComponent: () => import('./pages/servicio-form/servicio-form').then(m => m.ServicioForm) },
];
