# AutoAndes Frontend

Aplicación web de taller automotriz desarrollada con Angular standalone. El frontend consume la API REST versionada de AutoAndes y adapta las opciones visibles a los permisos incluidos en la sesión autenticada.

## Requisitos

- Node.js compatible con Angular 22.
- Backend AutoAndes ejecutándose en `http://localhost:8080`.
- Base de datos configurada y disponible para el backend.

## Ejecutar

Desde esta carpeta:

```powershell
npm install
npm start
```

Abre `http://localhost:4200`. La URL de la API está configurada en `src/environments/environment.ts` y `environment.development.ts` como `http://localhost:8080/api/v1`.

## Funcionalidades

- Inicio de sesión con almacenamiento temporal de sesión, vencimiento automático y cierre ante respuestas 401.
- Menú, rutas y acciones condicionadas por permisos del usuario.
- Catálogo de servicios con búsqueda, alta, edición y baja lógica.
- Vehículos con búsqueda por cliente, alta, edición y eliminación.
- Registro de órdenes con detalle dinámico, cálculo de importes, validaciones, consulta, filtros y anulación con motivo.
- Reporte de ingresos agrupados por servicio y periodo, con opción de impresión.

## Estructura

- `src/app/core`: autenticación, guards, interceptores, permisos y utilidades HTTP.
- `src/app/layout`: cada pieza visual (`header`, `sidebar` y `main-layout`) tiene su carpeta con TypeScript, HTML y CSS.
- `src/app/shared`: directivas compartidas y componentes/páginas organizados en carpetas propias.
- `src/app/features`: cada módulo tiene sus rutas y separa `models`, `services` y `pages`; cada pantalla mantiene juntos sus archivos TypeScript, HTML y CSS.

## Compilar

```powershell
npm run build
```
