# CHANGELOG - Historial de Versiones

Registro de cambios y versiones del **Sistema de Gestión y Localización de Resoluciones - UGEL N° 08 Cañete**.

---

## [v1.1.0] - 2026-09-13
### 🏗️ Reestructuración Arquitectónica y Capa Backend API REST
- **Backend Modular por Capas (`backend/`)**:
  - `backend/config/dataStore.js`: Almacén y lógica centralizada para persistencia de datos y estadísticas.
  - `backend/controllers/`: Controladores desacoplados para `resolucionesController.js`, `solicitudesController.js` y `ubicacionesController.js`.
  - `backend/routes/api.js`: Endpoints REST formales (`/api/resoluciones`, `/api/solicitudes`, `/api/ubicaciones`, `/api/stats`).
  - Servidor Express en `server.js` con soporte para URLs limpias, CORS y manejo de errores 404 personalizado.
- **Frontend Unificado (`js/services/apiClient.js` & Sidebar)**:
  - Creación de cliente HTTP centralizado para consumir los endpoints REST.
  - Estandarización de la navegación lateral (`renderSidebar`) en todos los módulos (`solicitudes.html`, `entregas.html`, `detalle-solicitud.html`), eliminando menús duplicados o desalineados.
  - Compatibilidad total de diseño y layout CSS semántico.
- **Bases de Datos (`database/schemas/`)**:
  - Organización de esquemas relacionales limpios para MySQL y SQL Server.

---

## [v1.0.1] - 2026-09-13
### ⚡ Servidor de Ejecución y Enrutamiento Limpio
- **Servidor Web Incorporado (`server.js`)**:
  - Implementación de servidor local con Node.js en el puerto 3000.
  - Soporte para URLs limpias (permite acceder tanto a `/dashboard` como a `/dashboard.html` sin error 404).
  - Configuración de `package.json` con comando directo `npm start`.

---

## [v1.0.0] - 2026-09-13
### 🚀 Lanzamiento Inicial
- **Estructura y Módulos Principales**:
  - Dashboard interactivo con indicadores y estadísticas (`dashboard.html`).
  - Módulo de resoluciones directorales (`resoluciones.html`, `detalle-resolucion.html`).
  - Registro de resoluciones con metadatos y ubicaciones físicas (`registrar-resolucion.html`).
  - Módulo de localización y mapa de archivo central/estantes (`ubicacion.html`).
  - Portal de consulta ciudadana (`consulta-ciudadano.html`).
  - Visor de resoluciones y documentos (`visor.html`).
  - Bandeja de solicitudes y trámites (`solicitudes.html`, `detalle-solicitud.html`).
  - Control de entregas y cargos de notificación (`entregas.html`).
  - Centro de notificaciones (`notificaciones.html`).
  - Reportes y exportación (`reportes.html`).
- **Seguridad**:
  - Configuración de `.gitignore` para bloquear credenciales, bases de datos locales, excels privados y archivos PDF reales.
