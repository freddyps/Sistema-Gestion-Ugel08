# Sistema de Gestión, Consulta y Localización de Resoluciones Directorales
### Unidad de Gestión Educativa Local N° 08 - Cañete (DRELP - GORE Lima)
**Versión 2.0.0** — *Edición Institucional con Roles, Permisos y Navegación Jerárquica*  
**Fecha de Publicación:** 13 de Septiembre de 2026

---

## 🏛️ 1. Arquitectura por Capas (Layered Architecture)

El sistema está diseñado bajo un modelo formal de **Arquitectura por Capas** desacoplada, asegurando mantenibilidad, separación estricta de responsabilidades y compatibilidad nativa (100% web estándar, sin dependencias de Node.js ni compiladores, operable en cualquier servidor Apache, cPanel, IIS o PHP):

```
┌────────────────────────────────────────────────────────────────────────┐
│                      1. CAPA DE PRESENTACIÓN (UI)                      │
│   - HTML5 Semántico + CSS Vanilla Institucional (css/styles.css)       │
│   - Páginas: Dashboard, Resoluciones, Ubicación, Solicitudes,          │
│              Entregas, Reportes, Visor de Documentos                   │
│   - Controladores de Vista: app.js, deliveryFlow.js, reports.js       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │  consume
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               2. CAPA DE LÓGICA DE NEGOCIO / SERVICIOS                 │
│   - resolutionService: Gestión integral, relaciones y filtros de RD    │
│   - requestService: Trámite de solicitudes de copias y legajos        │
│   - deliveryService: Emisión de enlaces seguros, vigencia y cargos    │
│   - locationService: Custodia física, ambientes, estantes y cajas      │
│   - historyService / notificationService: Trazabilidad y auditoría    │
│   - authService: Control de sesiones institucionales y perfiles        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │  persiste / consulta
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               3. CAPA DE ACCESO A DATOS (DATA ACCESS LAYER)            │
│   - db.js: Repositorio genérico CRUD (getTable, getById, insert, ...)  │
│   - apiClient.js: Abstracción lista para consumo REST / Backend PHP   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │  almacena
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  4. CAPA DE PERSISTENCIA Y DOMINIO                     │
│   - mockDatabase.js: Datos reales del acervo documental institucional │
│   - Storage Engine: Motor de sincronización en LocalStorage           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🏢 2. Reglas de Negocio Institucionales

### A. Resoluciones Directorales (`resolutionService`)
- **Estructura del Número:** Código oficial `RD-XXXX-YYYY` o `R.D. N.º XXX-YYYY`.
- **Estados:** `Registrado` ➔ `Pendiente de notificación` ➔ `Notificado` ➔ `Archivado`.
- **Trazabilidad Institucional:** Cada registro o modificación dispara un evento en `historyService` registrando fecha, usuario, acción y cambios de estado.
- **Relación con Custodia Física:** Cada resolución se vincula bidireccionalmente con su registro de ubicación (`caja`, `estante`, `ambiente`, `sede`).

### B. Solicitudes de Copias y Antecedentes (`requestService`)
- **Ciclo de Vida:**
  1. `PENDIENTE`: Requerimiento ingresado por mesa de partes o administrado.
  2. `DOCUMENTO LOCALIZADO`: Verificación positiva de la caja y folios en el archivo físico.
  3. `DOCUMENTO PREPARADO`: Selección y cotejo de PDFs autorizados para entrega.
  4. `ATENDIDA`: Emisión del enlace seguro y constancia para el administrado.
- **Auditoría Cruzada:** El cambio de estado de la solicitud se refleja automáticamente en la bitácora histórica de la resolución involucrada.

### C. Entregas Digitales y Cargos (`deliveryService`)
- **Código Institucional Único:** Generación del formato criptográfico `ENT-YYYY-XXXXXX`.
- **Vigencia Temporal:** Expiración calculada de 7 días hábiles a partir de la emisión.
- **Control de Accesos:** Monitoreo y conteo de descargas del administrado.
- **Vinculación de Solicitudes:** Al expedir una entrega desde una solicitud, esta pasa automáticamente a estado `ATENDIDA`.

---

## 📂 3. Estructura del Proyecto

```text
├── index.html                   # Punto de entrada y acceso institucional (Login)
├── pages/                       # Vistas y pantallas del sistema organizado
│   ├── dashboard.html           # Panel general de indicadores según rol
│   ├── resoluciones.html        # Gestión, búsqueda avanzada y modal de resoluciones
│   ├── registrar-resolucion.html# Formulario alternativo de registro/edición
│   ├── detalle-resolucion.html  # Dossier completo, trazabilidad y antecedentes
│   ├── ubicacion.html           # Localización física interactiva de cajas y estantes
│   ├── recepcion-archivo.html   # Bandeja de recepción de resoluciones remitidas
│   ├── usuarios.html            # Administración de cuentas y roles institucionales
│   ├── roles-permisos.html      # Matriz de privilegios y permisos por perfil
│   ├── configuracion.html       # Catálogos de configuración del sistema
│   ├── auditoria.html           # Registro cronológico e inmutable de operaciones
│   ├── solicitudes.html         # Bandeja de solicitudes de copias y legajos
│   ├── detalle-solicitud.html   # Preparación de folios y emisión de entrega digital
│   ├── entregas.html            # Registro y control de enlaces seguros y cargos
│   ├── reportes.html            # Métricas y estadísticas institucionales
│   └── visor.html               # Visor de documentos PDF oficiales
├── css/
│   └── styles.css               # Sistema de diseño institucional (Vanilla CSS)
├── assets/                      # Identidad gráfica institucional y demos
└── js/
    ├── app.js                   # Utilitarios UI, Sidebar unificado, Toasts
    ├── deliveryFlow.js          # Controlador de flujo de entrega y folios
    ├── locationExplorer.js      # Controlador de mapa y vista física de estantes
    ├── pdfViewer.js             # Controlador modal de visor PDF
    ├── reports.js               # Gráficos y cálculos estadísticos
    ├── search.js                # Algoritmos de búsqueda en memoria
    ├── data/
    │   └── mockDatabase.js      # Base de datos semilla institucional
    └── services/
        ├── db.js                # Data Access Layer (DAL)
        └── resolutionService.js # Capa de Servicios y Lógica de Negocio
```

---

## 🚀 4. Puesta en Marcha

1. Abra cualquier página principal (por ejemplo `index.html` o `dashboard.html`) directamente en su navegador web moderno.
2. No requiere comandos `npm`, `node` ni compiladores.
3. Para pruebas de roles, en `index.html` puede iniciar sesión con el perfil institucional deseado (Marcos, Administrador, Resoluciones o Consulta).
