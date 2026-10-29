import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';

export const VEHICULO_ROUTES: Routes = [
  { path: '', title: 'Vehículos', loadComponent: () => import('./pages/vehiculo-list/vehiculo-list').then(m => m.VehiculoList) },
  { path: 'nuevo', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_ESCRIBIR' }, title: 'Nuevo vehículo', loadComponent: () => import('./pages/vehiculo-form/vehiculo-form').then(m => m.VehiculoForm) },
  { path: ':id/editar', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_ESCRIBIR' }, title: 'Editar vehículo', loadComponent: () => import('./pages/vehiculo-form/vehiculo-form').then(m => m.VehiculoForm) },
];
