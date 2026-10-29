import { Routes } from '@angular/router';
import { permisoGuard } from '../../core/guards/permiso-guard';

export const ORDEN_ROUTES: Routes = [
  { path: '', title: 'Órdenes de servicio', loadComponent: () => import('./pages/orden-list/orden-list').then(m => m.OrdenList) },
  { path: 'nueva', canActivate: [permisoGuard], data: { permiso: 'ORDEN_REGISTRAR' }, title: 'Nueva orden', loadComponent: () => import('./pages/orden-form/orden-form').then(m => m.OrdenForm) },
  { path: ':id', title: 'Detalle de orden', loadComponent: () => import('./pages/orden-detail/orden-detail').then(m => m.OrdenDetail) },
];
