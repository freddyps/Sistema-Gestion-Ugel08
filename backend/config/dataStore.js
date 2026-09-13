const path = require('path');
const fs = require('fs');

class DataStore {
  constructor() {
    this.resoluciones = [];
    this.ubicaciones = [];
    this.solicitudes = [];
    this.entregas = [];
    this._init();
  }

  _init() {
    // Semilla inicial basada en datos institucionales reales
    this.resoluciones = [
      {
        id: 1,
        numero: "3874",
        numero_rd: "RD N° 003874-2026",
        anio: 2026,
        fecha_emision: "2026-08-14",
        administrado: "YARANGA GUTIERREZ LUIS ALBERTO",
        dni: "11670853",
        asunto: "RECONOCIMIENTO DE TIEMPO DE SERVICIOS DOCENTE",
        area_origen: "Área de Gestión Institucional / RR.HH.",
        estado: "Archivado",
        ubicacion: {
          sede: "Sede Principal",
          ambiente: "Archivo Central",
          estante: "Estante A",
          caja: "Caja 1",
          rango: "0001 - 0450"
        },
        documentos: [
          { id: "doc-1", nombre: "RD_003874_2026_FOLIADO.pdf", paginas: 8, tamanio: "2.4 MB" }
        ]
      },
      {
        id: 2,
        numero: "154",
        numero_rd: "RD N° 000154-2022",
        anio: 2022,
        fecha_emision: "2022-06-14",
        administrado: "JUAN PÉREZ RAMOS",
        dni: "42891044",
        asunto: "COPIA FEDATEADA DE RESOLUCIÓN Y ANTECEDENTES PARA REASIGNACIÓN",
        area_origen: "Recursos Humanos",
        estado: "Archivado",
        ubicacion: {
          sede: "Sede Principal",
          ambiente: "Ambiente N° 1 - Legajos Docentes",
          estante: "E-03",
          caja: "Caja 18",
          rango: "RD 140 – RD 160"
        },
        documentos: [
          { id: "doc-2", nombre: "RD_000154_2022.pdf", paginas: 18, tamanio: "4.8 MB" }
        ]
      },
      {
        id: 3,
        numero: "452",
        numero_rd: "RD N° 000452-2024",
        anio: 2024,
        fecha_emision: "2024-03-20",
        administrado: "ESCOBAR ODAR YESENIA PATRICIA",
        dni: "51725357",
        asunto: "ASIGNACIÓN POR TIEMPO DE SERVICIOS 25 AÑOS",
        area_origen: "Administración / Planillas",
        estado: "Notificado",
        ubicacion: {
          sede: "Sede Principal",
          ambiente: "Archivo Central",
          estante: "Estante B",
          caja: "Caja 5",
          rango: "0400 - 0800"
        },
        documentos: [
          { id: "doc-3", nombre: "RD_000452_2024.pdf", paginas: 6, tamanio: "1.9 MB" }
        ]
      }
    ];

    this.solicitudes = [
      {
        codigo: "SOL-2026-000125",
        fecha: "2026-09-02",
        solicitante: "Juan Pérez Ramos",
        dni: "42891044",
        tipo: "Copia de resolución y antecedentes",
        rdSolicitada: "RD N° 000154-2022",
        anio: 2022,
        estado: "DOCUMENTO LOCALIZADO",
        caja: "Caja 18"
      },
      {
        codigo: "SOL-2026-000124",
        fecha: "2026-09-01",
        solicitante: "Carmen Rosa Quispe Flores",
        dni: "09823145",
        tipo: "Búsqueda y desarchivo de RD",
        rdSolicitada: "RD N° 000452-2024",
        anio: 2024,
        estado: "EN BÚSQUEDA FÍSICA",
        caja: "Caja 5"
      },
      {
        codigo: "SOL-2026-000123",
        fecha: "2026-08-30",
        solicitante: "Luis Alberto Yaranga",
        dni: "11670853",
        tipo: "Constancia de Notificación",
        rdSolicitada: "RD N° 003874-2026",
        anio: 2026,
        estado: "DIGITALIZADO",
        caja: "Caja 1"
      }
    ];

    this.ubicaciones = [
      { id: 1, sede: "Sede Principal", ambiente: "Archivo Central", estante: "Estante A", caja: "Caja 1", rango: "0001 - 0450", cantidad: 450, ocupacion: 85 },
      { id: 2, sede: "Sede Principal", ambiente: "Archivo Central", estante: "Estante B", caja: "Caja 5", rango: "0400 - 0800", cantidad: 400, ocupacion: 72 },
      { id: 3, sede: "Sede Principal", ambiente: "Ambiente N° 1 - Legajos", estante: "Estante E-03", caja: "Caja 18", rango: "RD 140 – RD 160", cantidad: 21, ocupacion: 90 }
    ];
  }

  // Resoluciones API
  getResoluciones(query = {}) {
    let result = [...this.resoluciones];
    if (query.q) {
      const q = query.q.toLowerCase();
      result = result.filter(r => 
        r.numero.includes(q) || 
        r.numero_rd.toLowerCase().includes(q) || 
        r.administrado.toLowerCase().includes(q) ||
        r.asunto.toLowerCase().includes(q) ||
        (r.dni && r.dni.includes(q))
      );
    }
    if (query.anio) {
      result = result.filter(r => String(r.anio) === String(query.anio));
    }
    if (query.caja) {
      result = result.filter(r => r.ubicacion && r.ubicacion.caja.toLowerCase().includes(query.caja.toLowerCase()));
    }
    return result;
  }

  getResolucionById(id) {
    return this.resoluciones.find(r => String(r.id) === String(id) || r.numero === String(id) || r.numero_rd.includes(String(id))) || null;
  }

  createResolucion(data) {
    const newId = this.resoluciones.length > 0 ? Math.max(...this.resoluciones.map(r => r.id)) + 1 : 1;
    const newRD = {
      id: newId,
      numero: data.numero || String(newId),
      numero_rd: data.numero_rd || `RD N° ${String(data.numero).padStart(6, '0')}-${data.anio || 2026}`,
      anio: Number(data.anio) || 2026,
      fecha_emision: data.fecha_emision || new Date().toISOString().split('T')[0],
      administrado: (data.administrado || "ADMINISTRADO GENERAL").toUpperCase(),
      dni: data.dni || "",
      asunto: (data.asunto || "RESOLUCIÓN DIRECTORAL").toUpperCase(),
      area_origen: data.area_origen || "Recursos Humanos",
      estado: data.estado || "Archivado",
      ubicacion: {
        sede: data.sede || "Sede Principal",
        ambiente: data.ambiente || "Archivo Central",
        estante: data.estante || "Estante A",
        caja: data.caja || "Caja 1",
        rango: data.rango || ""
      },
      documentos: [
        { id: `doc-${newId}`, nombre: `RD_${newId}_2026.pdf`, paginas: Number(data.paginas) || 4, tamanio: "1.5 MB" }
      ]
    };
    this.resoluciones.unshift(newRD);
    return newRD;
  }

  // Solicitudes API
  getSolicitudes() {
    return [...this.solicitudes];
  }

  getSolicitudByCodigo(codigo) {
    return this.solicitudes.find(s => s.codigo.toLowerCase() === codigo.toLowerCase()) || null;
  }

  updateSolicitudEstado(codigo, nuevoEstado) {
    const item = this.solicitudes.find(s => s.codigo.toLowerCase() === codigo.toLowerCase());
    if (item) {
      item.estado = nuevoEstado;
      return item;
    }
    return null;
  }

  // Ubicaciones API
  getUbicaciones() {
    return [...this.ubicaciones];
  }

  // Dashboard Stats
  getStats() {
    return {
      totalResoluciones: 12480, // Estimado institucional
      totalArchivadas: 11890,
      totalDigitalizadas: 8940,
      solicitudesPendientes: this.solicitudes.filter(s => s.estado !== 'ENTREGADO').length,
      cajasActivas: 250,
      sede: "UGEL N° 08 Cañete"
    };
  }
}

module.exports = new DataStore();
