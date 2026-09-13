/* ==========================================================================
   UGEL 08 CAÑETE - MOCK DATASET & STATE STORAGE (EXPANDIDO)
   Gestión de Resoluciones, Solicitudes, Documentos Digitales y Entregas
   ========================================================================== */

const INITIAL_SOLICITUDES = [
  {
    codigo: "SOL-2026-000125",
    fecha: "02/09/2026",
    solicitante: "Juan Pérez Ramos",
    dni: "42891044",
    tipo: "Copia de resolución y antecedentes",
    motivo: "Solicitud de copia fedateada de Resolución Directoral y antecedentes para trámite de reasignación.",
    rdSolicitada: "R.D. N.º 154-2022",
    rdNumero: "154",
    rdAnio: 2022,
    estado: "DOCUMENTO LOCALIZADO",
    ubicacionFisica: {
      local: "Archivo Central",
      ambiente: "Ambiente N° 1 - Legajos Docentes",
      estante: "E-03",
      caja: "Caja 18",
      rango: "R.D. 140 – R.D. 160",
      folder: "Folder F-12"
    },
    documentosDisponibles: [
      {
        id: "doc-154-1",
        nombre: "R.D. N.º 154-2022.pdf",
        tipo: "Resolución Directoral",
        paginas: 18,
        tamano: "4.8 MB",
        fecha: "14/06/2022",
        estado: "Digitalizado Alta Calidad",
        defaultSelected: true
      },
      {
        id: "doc-154-2",
        nombre: "Antecedente 01 - Informe Escalafonario.pdf",
        tipo: "Antecedente",
        paginas: 12,
        tamano: "2.1 MB",
        fecha: "02/06/2022",
        estado: "Digitalizado",
        defaultSelected: true
      },
      {
        id: "doc-154-3",
        nombre: "Antecedente 02 - Solicitud y Anexos.pdf",
        tipo: "Antecedente",
        paginas: 8,
        tamano: "1.4 MB",
        fecha: "28/05/2022",
        estado: "Digitalizado",
        defaultSelected: false
      },
      {
        id: "doc-154-4",
        nombre: "Informe Técnico Legal N° 45.pdf",
        tipo: "Informe",
        paginas: 6,
        tamano: "900 KB",
        fecha: "10/06/2022",
        estado: "Digitalizado",
        defaultSelected: false
      }
    ]
  },
  {
    codigo: "SOL-2026-000126",
    fecha: "01/09/2026",
    solicitante: "María Torres Quintana",
    dni: "10982341",
    tipo: "Antecedentes y legajo",
    motivo: "Copia de informe sustentatorio de nombramiento para verificación de tiempo de servicio.",
    rdSolicitada: "R.D. N.º 087-2020",
    rdNumero: "087",
    rdAnio: 2020,
    estado: "PENDIENTE",
    ubicacionFisica: {
      local: "Archivo Histórico (Anexo 2)",
      ambiente: "Ambiente B - Legajos Pasivos",
      estante: "E-15",
      caja: "Caja 50",
      rango: "R.D. 070 – R.D. 100",
      folder: "Folder F-04"
    },
    documentosDisponibles: [
      {
        id: "doc-087-1",
        nombre: "R.D. N.º 087-2020.pdf",
        tipo: "Resolución Directoral",
        paginas: 10,
        tamano: "2.4 MB",
        fecha: "20/04/2020",
        estado: "Digitalizado",
        defaultSelected: true
      },
      {
        id: "doc-087-2",
        nombre: "Expediente de Calificación.pdf",
        tipo: "Antecedente",
        paginas: 15,
        tamano: "3.2 MB",
        fecha: "12/04/2020",
        estado: "Digitalizado",
        defaultSelected: false
      }
    ]
  },
  {
    codigo: "SOL-2026-000127",
    fecha: "30/08/2026",
    solicitante: "Oficina de Personal - UGEL 08",
    dni: "Oficio N° 342-2026-PER",
    tipo: "Resolución y Anexo Interno",
    motivo: "Requerimiento interno para auditoría de pagos de encargaturas.",
    rdSolicitada: "R.D. N.º 231-2019",
    rdNumero: "231",
    rdAnio: 2019,
    estado: "ATENDIDA",
    ubicacionFisica: {
      local: "Archivo Central",
      ambiente: "Ambiente N° 2 - Trámite Documentario",
      estante: "E-01",
      caja: "Caja 04",
      rango: "R.D. 220 – R.D. 250",
      folder: "Folder F-08"
    },
    documentosDisponibles: [
      {
        id: "doc-231-1",
        nombre: "R.D. N.º 231-2019.pdf",
        tipo: "Resolución Directoral",
        paginas: 14,
        tamano: "3.8 MB",
        fecha: "18/09/2019",
        estado: "Digitalizado",
        defaultSelected: true
      }
    ]
  },
  {
    codigo: "SOL-2026-000128",
    fecha: "02/09/2026",
    solicitante: "Lic. Roberto Dávila Campos",
    dni: "08765432",
    tipo: "Copia de resolución",
    motivo: "Constancia de reconocimiento de años de servicios.",
    rdSolicitada: "R.D. N.º 0089-2024",
    rdNumero: "0089",
    rdAnio: 2024,
    estado: "EN REVISIÓN",
    ubicacionFisica: {
      local: "Archivo Central (Sede Principal)",
      ambiente: "Ambiente N° 2 - Trámite Documentario",
      estante: "E-01",
      caja: "Caja 04",
      rango: "R.D. 080 – R.D. 100",
      folder: "Folder F-12"
    },
    documentosDisponibles: [
      {
        id: "doc-089-1",
        nombre: "R.D. N.º 0089-2024.pdf",
        tipo: "Resolución Directoral",
        paginas: 8,
        tamano: "1.9 MB",
        fecha: "08/01/2024",
        estado: "Digitalizado",
        defaultSelected: true
      }
    ]
  }
];

const INITIAL_ENTREGAS = [
  {
    codigo: "ENT-2026-000045",
    solicitudCodigo: "SOL-2026-000125",
    solicitante: "Juan Pérez Ramos",
    resolucion: "R.D. N.º 154-2022",
    documentos: [
      { nombre: "R.D. N.º 154-2022.pdf", paginas: 18, tamano: "4.8 MB" },
      { nombre: "Antecedente 01 - Informe Escalafonario.pdf", paginas: 12, tamano: "2.1 MB" }
    ],
    totalDocumentos: 2,
    totalPaginas: 30,
    totalPeso: "6.9 MB",
    fechaCreacion: "02/09/2026",
    fechaVencimiento: "09/09/2026",
    medio: "Enlace Seguro / WhatsApp",
    estado: "DISPONIBLE",
    accesos: 3,
    enlace: "https://sistema-demo-ugel/documentos/ENT-2026-000045"
  },
  {
    codigo: "ENT-2026-000044",
    solicitudCodigo: "SOL-2026-000127",
    solicitante: "Oficina de Personal - UGEL 08",
    resolucion: "R.D. N.º 231-2019",
    documentos: [
      { nombre: "R.D. N.º 231-2019.pdf", paginas: 14, tamano: "3.8 MB" }
    ],
    totalDocumentos: 1,
    totalPaginas: 14,
    totalPeso: "3.8 MB",
    fechaCreacion: "31/08/2026",
    fechaVencimiento: "07/09/2026",
    medio: "Enlace Interno",
    estado: "DISPONIBLE",
    accesos: 5,
    enlace: "https://sistema-demo-ugel/documentos/ENT-2026-000044"
  }
];

const INITIAL_RESOLUCIONES = [
  {
    id: "RD-2024-0125",
    numero: "0125",
    numeroCompleto: "RD N.º 0125-2024",
    anio: 2024,
    usuario: "Prof. Juan Carlos Mendoza Paredes",
    fecha: "15/01/2024",
    detalle: "Aprobar contrato docente de educación secundaria en la especialidad de Matemática para la I.E. CNI 20066 San Luis.",
    notificacion: "NOTIFICADA",
    fechaNotificacion: "18/01/2024",
    documentosCount: 3,
    ubicacion: {
      local: "Archivo Central (Sede Principal)",
      ambiente: "Ambiente N° 1 - Legajos Docentes",
      estante: "E-03",
      caja: "C-15",
      folder: "F-08"
    }
  },
  {
    id: "RD-2022-0154",
    numero: "0154",
    numeroCompleto: "R.D. N.º 154-2022",
    anio: 2022,
    usuario: "Juan Pérez Ramos",
    fecha: "14/06/2022",
    detalle: "Aprobación de reasignación por interés personal en el nivel secundario y reconocimiento de escala magisterial.",
    notificacion: "NOTIFICADA",
    fechaNotificacion: "17/06/2022",
    documentosCount: 4,
    ubicacion: {
      local: "Archivo Central (Sede Principal)",
      ambiente: "Ambiente N° 1 - Legajos Docentes",
      estante: "E-03",
      caja: "Caja 18",
      folder: "Folder F-12"
    }
  },
  {
    id: "RD-2024-0124",
    numero: "0124",
    numeroCompleto: "RD N.º 0124-2024",
    anio: 2024,
    usuario: "Dra. María Elena Ramos Quispe",
    fecha: "12/01/2024",
    detalle: "Otorgar subsidio por luto y sepelio al personal docente nombrado por fallecimiento de familiar directo.",
    notificacion: "PENDIENTE",
    fechaNotificacion: "-",
    documentosCount: 2,
    ubicacion: {
      local: "Archivo Central (Sede Principal)",
      ambiente: "Ambiente N° 1 - Legajos Docentes",
      estante: "E-03",
      caja: "C-15",
      folder: "F-07"
    }
  },
  {
    id: "RD-2024-0089",
    numero: "0089",
    numeroCompleto: "RD N.º 0089-2024",
    anio: 2024,
    usuario: "Lic. Roberto Dávila Campos",
    fecha: "08/01/2024",
    detalle: "Reconocimiento de años de servicios prestados a la gestión pública en el sector educación Cañete.",
    notificacion: "NOTIFICADA",
    fechaNotificacion: "10/01/2024",
    documentosCount: 2,
    ubicacion: {
      local: "Archivo Central (Sede Principal)",
      ambiente: "Ambiente N° 2 - Trámite Documentario",
      estante: "E-01",
      caja: "C-04",
      folder: "F-12"
    }
  },
  {
    id: "RD-2023-4521",
    numero: "4521",
    numeroCompleto: "RD N.º 4521-2023",
    anio: 2023,
    usuario: "I.E. N° 20174 Santa Rita de Cassia",
    fecha: "18/11/2023",
    detalle: "Concesión de licencia sin goce de haber para la Subdirectora por motivos personales justificantes.",
    notificacion: "OBSERVADA",
    fechaNotificacion: "22/11/2023",
    documentosCount: 1,
    ubicacion: {
      local: "Archivo Histórico (Anexo 2)",
      ambiente: "Ambiente A - Resoluciones Antiguas",
      estante: "E-12",
      caja: "C-42",
      folder: "F-03"
    }
  },
  {
    id: "RD-2020-0087",
    numero: "0087",
    numeroCompleto: "R.D. N.º 087-2020",
    anio: 2020,
    usuario: "María Torres Quintana",
    fecha: "20/04/2020",
    detalle: "Aprobación de cuadro de méritos y ratificación docente extraordinaria en periodo no presencial.",
    notificacion: "NOTIFICADA",
    fechaNotificacion: "24/04/2020",
    documentosCount: 2,
    ubicacion: {
      local: "Archivo Histórico (Anexo 2)",
      ambiente: "Ambiente B - Legajos Pasivos",
      estante: "E-15",
      caja: "Caja 50",
      folder: "Folder F-04"
    }
  }
];

const ESTRUCTURA_LOCALES = [
  {
    id: "loc-1",
    nombre: "Archivo Central (Sede Principal)",
    direccion: "Av. Mariscal Benavides 1370, San Vicente de Cañete",
    ambientes: [
      {
        id: "amb-1",
        nombre: "Ambiente N° 1 - Legajos Docentes",
        estantes: [
          {
            id: "est-1",
            nombre: "Estante E-01",
            cajas: ["C-01", "C-02", "C-03", "C-04", "C-05"]
          },
          {
            id: "est-3",
            nombre: "Estante E-03",
            cajas: ["C-14", "C-15", "C-16", "C-17", "Caja 18"]
          },
          {
            id: "est-4",
            nombre: "Estante E-04",
            cajas: ["C-18", "C-19", "C-20"]
          }
        ]
      },
      {
        id: "amb-2",
        nombre: "Ambiente N° 2 - Trámite Documentario",
        estantes: [
          {
            id: "est-10",
            nombre: "Estante E-01",
            cajas: ["C-01", "C-02", "C-04"]
          }
        ]
      }
    ]
  },
  {
    id: "loc-2",
    nombre: "Archivo Histórico (Anexo 2)",
    direccion: "Jr. O'Higgins 420, San Vicente de Cañete",
    ambientes: [
      {
        id: "amb-A",
        nombre: "Ambiente A - Resoluciones Antiguas",
        estantes: [
          {
            id: "est-12",
            nombre: "Estante E-12",
            cajas: ["C-40", "C-41", "C-42", "C-43"]
          }
        ]
      },
      {
        id: "amb-B",
        nombre: "Ambiente B - Legajos Pasivos",
        estantes: [
          {
            id: "est-8",
            nombre: "Estante E-08",
            cajas: ["C-24", "C-25", "C-26"]
          },
          {
            id: "est-15",
            nombre: "Estante E-15",
            cajas: ["C-49", "C-50", "C-51", "Caja 50"]
          }
        ]
      }
    ]
  }
];

// Helper Store
class ResolutionStore {
  // Solicitudes
  static getSolicitudes() {
    const saved = localStorage.getItem("UGEL_SOLICITUDES_DATA");
    if (!saved) {
      localStorage.setItem("UGEL_SOLICITUDES_DATA", JSON.stringify(INITIAL_SOLICITUDES));
      return INITIAL_SOLICITUDES;
    }
    return JSON.parse(saved);
  }

  static getSolicitudByCodigo(codigo) {
    const list = this.getSolicitudes();
    return list.find(s => s.codigo === codigo || s.codigo.includes(codigo)) || list[0];
  }

  static updateSolicitudEstado(codigo, nuevoEstado) {
    const list = this.getSolicitudes();
    const idx = list.findIndex(s => s.codigo === codigo);
    if (idx !== -1) {
      list[idx].estado = nuevoEstado;
      localStorage.setItem("UGEL_SOLICITUDES_DATA", JSON.stringify(list));
    }
  }

  // Entregas Digitales
  static getEntregas() {
    const saved = localStorage.getItem("UGEL_ENTREGAS_DATA");
    if (!saved) {
      localStorage.setItem("UGEL_ENTREGAS_DATA", JSON.stringify(INITIAL_ENTREGAS));
      return INITIAL_ENTREGAS;
    }
    return JSON.parse(saved);
  }

  static getEntregaByCodigo(codigo) {
    const list = this.getEntregas();
    return list.find(e => e.codigo === codigo || e.codigo.replace(/-/g, '').toLowerCase() === codigo.replace(/-/g, '').toLowerCase());
  }

  static saveEntrega(nuevaEntrega) {
    const list = this.getEntregas();
    list.unshift(nuevaEntrega);
    localStorage.setItem("UGEL_ENTREGAS_DATA", JSON.stringify(list));
    return nuevaEntrega;
  }

  // Resoluciones
  static getResoluciones() {
    const saved = localStorage.getItem("UGEL_RESOLUCIONES_DATA");
    if (!saved) {
      localStorage.setItem("UGEL_RESOLUCIONES_DATA", JSON.stringify(INITIAL_RESOLUCIONES));
      return INITIAL_RESOLUCIONES;
    }
    return JSON.parse(saved);
  }

  static getResolucionById(id) {
    const list = this.getResoluciones();
    return list.find(item => item.id === id || item.numeroCompleto.includes(id) || item.numero === id);
  }

  static saveResolucion(newRD) {
    const list = this.getResoluciones();
    list.unshift(newRD);
    localStorage.setItem("UGEL_RESOLUCIONES_DATA", JSON.stringify(list));
    return newRD;
  }

  static getStats() {
    const list = this.getResoluciones();
    const solicitudes = this.getSolicitudes();
    const entregas = this.getEntregas();

    const total = list.length + 14840;
    const delAnio = list.filter(r => r.anio === 2024).length + 1235;
    const notificadas = list.filter(r => r.notificacion === "NOTIFICADA").length + 13910;
    const pendientes = list.filter(r => r.notificacion === "PENDIENTE").length + 640;
    const observadas = list.filter(r => r.notificacion === "OBSERVADA").length + 290;

    return { 
      total, 
      delAnio, 
      notificadas, 
      pendientes, 
      observadas,
      totalSolicitudes: solicitudes.length + 184,
      solicitudesPendientes: solicitudes.filter(s => s.estado === 'PENDIENTE' || s.estado === 'EN REVISIÓN').length + 12,
      totalEntregas: entregas.length + 320
    };
  }
}
