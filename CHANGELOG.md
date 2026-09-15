# CHANGELOG - Historial de Versiones

Registro de cambios y versiones del **Sistema de Gestión y Localización de Resoluciones - UGEL N° 08 Cañete**.

---

## [v2.1.0] - 2026-09-15
### 💎 Modal Interactivo Unificado, Optimización de Rendimiento y Pulido de Interfaz
**Nombre de la Versión:** *"Modal Unificado y Experiencia de Usuario de Alto Rendimiento"*

- **Modal Interactivo Unificado para Resoluciones**:
  - Registro y edición integrados completamente en modal dinámico sin recargar la página.
  - Dimensiones optimizadas con scroll vertical independiente y visibilidad total de bloques de datos.
  - Retiro de página separada redundante para unificar el flujo en un único punto.
- **Correcciones de Interfaz y Usabilidad (UI/UX)**:
  - Corrección de superposición y z-index en dropdowns de filtros.
  - Limpieza del sidebar: remoción del submódulo innecesario de Historial de Emisiones y Custodia.
- **Rendimiento y Navegación**:
- **Reorganización Estructural del Proyecto (`pages/`)**:
  - Centralización de todas las pantallas y vistas HTML del sistema dentro de la carpeta `pages/`, manteniendo `index.html` en la raíz como punto de acceso y autenticación.
  - Actualización limpia de referencias relativas (`css/`, `js/`, `assets/`) y compatibilidad total con navegación directa en navegador.

---

## [v2.0.0] - 2026-09-13
### 🚀 Reorganización Institucional por Roles, Permisos y Navegación Jerárquica
**Nombre de la Versión:** *"Estructura Institucional Basada en Roles y Separación de Funciones"*

- **Control de Acceso Basado en Roles y Permisos (RBAC)**:
  - Implementación de 3 perfiles institucionales diferenciados:
    1. **Oficina de Resoluciones (María Angélica)**: Registro de RD autógrafas firmadas por Director, metadatos, adjuntar PDF, notificaciones y acción formal `[Remitir a Archivo]`.
    2. **Archivo Central (Marcos)**: Bandeja de recepción física (`recepcion-archivo.html`), confirmación de ingreso de originales y localización física (Sede, Estante, Archivador, Caja y Rango).
    3. **Administrador del Sistema**: Gestión de usuarios (`usuarios.html`), matriz de permisos (`roles-permisos.html`), configuración de catálogos (`configuracion.html`) y auditoría cronológica (`auditoria.html`).
- **Jerarquía de Navegación (Sidebar Unificado)**:
  - Estructuración estricta en dos módulos principales: **Inicio** y **Resoluciones**.
  - Menú desplegable interactivo en **Resoluciones** que agrupa todos los submódulos correspondientes al perfil del usuario.
  - Apertura automática contextual y resalte activo del submódulo seleccionado.
- **Desacoplamiento de Módulos Externos**:
  - Remoción completa de Mesa de Partes y Personal Autorizado, simplificando el acceso exclusivamente al personal operativo institucional.
- **Dashboard Reactivo**:
  - `dashboard.html` adapta indicadores KPIs, accesos directos y tablas de auditoría según el rol en sesión.

---
### 🏛️ Implementación Formal de Arquitectura por Capas (Layered Architecture)
- **Capa de Lógica de Negocio (`js/services/resolutionService.js`)**:
  - Incorporación formal de `requestService` (reglas de negocio de solicitudes de copias, verificación de custodia física en cajas y ciclo de vida de requerimientos).
  - Incorporación formal de `deliveryService` (generación de enlaces seguros únicos `ENT-YYYY-XXXXXX`, cálculo de vigencia institucional de 7 días y registro de accesos).
  - Trazabilidad y auditoría cruzada automática en `historyService`.
- **Capa de Acceso a Datos (DAL - `js/services/db.js`)**:
  - Sincronización transparente de colecciones en LocalStorage y fallback a `SEED_DATA` para `solicitudes` y `entregas`.
- **Capa de Presentación (UI Desacoplada)**:
  - Eliminación de scripts residuales de Tailwind CDN en `solicitudes.html` y `detalle-solicitud.html`.
  - Adopción integral del sistema de diseño institucional Vanilla CSS (`css/styles.css`).
  - Controladores de vista desacoplados de persistencias directas.

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
