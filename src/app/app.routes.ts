import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard, invitadoGuard } from './core/guards/auth-guard';
import { permisoGuard } from './core/guards/permiso-guard';

export const routes: Routes = [
  { path: 'login', title: 'Iniciar sesión', canActivate: [invitadoGuard], loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login) },
  {
    path: '', component: MainLayout, canActivate: [authGuard], canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', title: 'Inicio', loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio) },
      { path: 'servicios', canActivate: [permisoGuard], data: { permiso: 'SERVICIO_LEER' }, loadChildren: () => import('./features/servicios/servicios.routes').then(m => m.SERVICIO_ROUTES) },
      { path: 'vehiculos', canActivate: [permisoGuard], data: { permiso: 'VEHICULO_LEER' }, loadChildren: () => import('./features/vehiculos/vehiculos.routes').then(m => m.VEHICULO_ROUTES) },
      { path: 'ordenes', canActivate: [permisoGuard], data: { permiso: 'ORDEN_LEER' }, loadChildren: () => import('./features/ordenes/ordenes.routes').then(m => m.ORDEN_ROUTES) },
      { path: 'reportes/ingresos-por-servicio', canActivate: [permisoGuard], data: { permiso: 'REPORTE_VER' }, title: 'Ingresos por servicio', loadComponent: () => import('./features/reportes/ingresos-servicio/ingresos-servicio').then(m => m.ReportePage) },
      { path: 'acceso-denegado', title: 'Acceso denegado', loadComponent: () => import('./shared/pages/acceso-denegado/acceso-denegado').then(m => m.AccesoDenegado) },
    ],
  },
  { path: '**', title: 'Página no encontrada', loadComponent: () => import('./shared/pages/no-encontrado/no-encontrado').then(m => m.NoEncontrado) },
];
