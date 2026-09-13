# CHANGELOG - Historial de Versiones

Registro de cambios y versiones del **Sistema de Gestión y Localización de Resoluciones - UGEL N° 08 Cañete**.

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
