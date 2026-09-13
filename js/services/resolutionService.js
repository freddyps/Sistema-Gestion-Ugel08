/**
 * SERVICIOS DE DATOS ESPECÍFICOS DE ENTIDADES
 * - resolutionService
 * - personService
 * - documentService
 * - locationService
 * - notificationService
 * - historyService
 * - antecedentService
 * - authService
 */

// 1. SERVICIO DE PERSONAS / ADMINISTRADOS
const personService = {
  getAll() {
    return window.db.getTable("personas");
  },
  getById(id) {
    return window.db.getById("personas", id);
  },
  findByDni(dni) {
    const list = this.getAll();
    return list.find(p => p.dni && p.dni.trim() === String(dni).trim()) || null;
  },
  createOrGet(personData) {
    if (personData.dni) {
      const existing = this.findByDni(personData.dni);
      if (existing) {
        return window.db.update("personas", existing.id, personData);
      }
    }
    return window.db.insert("personas", {
      dni: personData.dni || "",
      nombres: personData.nombres || "",
      apellidos: personData.apellidos || "",
      tipo_persona: personData.tipo_persona || "Administrado",
      telefono: personData.telefono || "",
      correo: personData.correo || "",
      estado: "Activo"
    });
  }
};

// 2. SERVICIO DE UBICACIONES FÍSICAS
const locationService = {
  getAll() {
    return window.db.getTable("ubicaciones");
  },
  getById(id) {
    return window.db.getById("ubicaciones", id);
  },
  create(data) {
    return window.db.insert("ubicaciones", {
      sede: data.sede || "Sede Principal",
      ambiente: data.ambiente || "Archivo",
      estante: data.estante || "Estante A",
      archivador: data.archivador || "Archivador 01",
      caja: data.caja || "Caja 001",
      rango: data.rango || "",
      ubicacion_adicional: data.ubicacion_adicional || "",
      estado_archivo: data.estado_archivo || "Archivado",
      observacion: data.observacion || ""
    });
  },
  update(id, data) {
    return window.db.update("ubicaciones", id, data);
  },
  search(query) {
    const list = this.getAll();
    if (!query) return list;
    const q = query.toLowerCase().trim();
    return list.filter(u => 
      (u.caja && u.caja.toLowerCase().includes(q)) ||
      (u.rango && u.rango.toLowerCase().includes(q)) ||
      (u.sede && u.sede.toLowerCase().includes(q)) ||
      (u.ambiente && u.ambiente.toLowerCase().includes(q)) ||
      (u.estante && u.estante.toLowerCase().includes(q))
    );
  }
};

// 3. SERVICIO DE DOCUMENTOS DIGITALES
const documentService = {
  getAll() {
    return window.db.getTable("documentos");
  },
  getById(id) {
    return window.db.getById("documentos", id);
  },
  getByResolutionId(resolutionId) {
    const list = this.getAll();
    return list.find(d => Number(d.resolucion_id) === Number(resolutionId)) || null;
  },
  create(data) {
    return window.db.insert("documentos", {
      resolucion_id: data.resolucion_id || null,
      nombre_archivo: data.nombre_archivo || "documento.pdf",
      tipo_documento: data.tipo_documento || "Resolución Directoral",
      ruta_archivo: data.ruta_archivo || "assets/demo-rd.pdf",
      numero_paginas: Number(data.numero_paginas) || 1,
      tamanio: data.tamanio || "1.0 MB",
      fecha_documento: data.fecha_documento || new Date().toISOString().split("T")[0],
      estado: data.estado || "Disponible"
    });
  },
  update(id, data) {
    return window.db.update("documentos", id, data);
  }
};

// 4. SERVICIO DE NOTIFICACIONES
const notificationService = {
  getAll() {
    return window.db.getTable("notificaciones");
  },
  getById(id) {
    return window.db.getById("notificaciones", id);
  },
  getByResolutionId(resolutionId) {
    const list = this.getAll();
    return list.find(n => Number(n.resolucion_id) === Number(resolutionId)) || null;
  },
  create(data) {
    return window.db.insert("notificaciones", {
      resolucion_id: data.resolucion_id,
      destinatario: data.destinatario || "",
      medio: data.medio || "Correo electrónico",
      fecha_notificacion: data.fecha_notificacion || "",
      estado: data.estado || "Pendiente",
      observacion: data.observacion || ""
    });
  },
  update(id, data) {
    return window.db.update("notificaciones", id, data);
  }
};

// 5. SERVICIO DE HISTORIAL / TRAZABILIDAD
const historyService = {
  getAll() {
    return window.db.getTable("historial_resoluciones");
  },
  getByResolutionId(resolutionId) {
    const list = this.getAll();
    return list
      .filter(h => Number(h.resolucion_id) === Number(resolutionId))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  },
  logAction({ resolucion_id, accion, descripcion, usuario = "Administrador", estado_anterior = "", estado_nuevo = "" }) {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return window.db.insert("historial_resoluciones", {
      resolucion_id: Number(resolucion_id),
      accion,
      descripcion,
      usuario,
      fecha: formattedDate,
      estado_anterior,
      estado_nuevo
    });
  }
};

// 6. SERVICIO DE ANTECEDENTES
const antecedentService = {
  getAll() {
    return window.db.getTable("antecedentes");
  },
  getByResolutionId(resolutionId) {
    const list = this.getAll();
    return list.filter(a => Number(a.resolucion_id) === Number(resolutionId));
  }
};

// 7. SERVICIO PRINCIPAL: RESOLUCIONES DIRECTORALES
const resolutionService = {
  getAll() {
    const rawResoluciones = window.db.getTable("resoluciones");
    // Enriquecer cada resolución con los objetos relacionados
    return rawResoluciones.map(r => this._enrich(r));
  },

  getById(id) {
    const raw = window.db.getById("resoluciones", id);
    if (!raw) return null;
    return this._enrich(raw);
  },

  findByNumero(numero) {
    if (!numero) return null;
    const numClean = String(numero).replace(/[^\d]/g, "");
    const all = this.getAll();
    return all.find(r => {
      const rNum = String(r.numero_rd).replace(/[^\d]/g, "");
      return rNum.includes(numClean);
    }) || null;
  },

  _enrich(r) {
    const persona = r.administrado_id ? personService.getById(r.administrado_id) : null;
    const ubicacion = r.ubicacion_id ? locationService.getById(r.ubicacion_id) : null;
    const documento = r.documento_id ? documentService.getById(r.documento_id) : null;
    const notificacion = notificationService.getByResolutionId(r.id);
    const antecedentes = antecedentService.getByResolutionId(r.id);
    const historial = historyService.getByResolutionId(r.id);

    return {
      ...r,
      persona,
      ubicacion,
      documento,
      notificacion,
      antecedentes,
      historial,
      // Propiedades de conveniencia para filtros y visualización rápida
      administrado_nombre: persona ? `${persona.nombres} ${persona.apellidos}`.trim() : "No registrado",
      administrado_dni: persona ? persona.dni : "",
      tiene_documento: Boolean(documento && documento.estado === "Disponible"),
      tiene_ubicacion: Boolean(ubicacion && ubicacion.caja),
      ubicacion_caja: ubicacion ? ubicacion.caja : "Sin ubicación",
      ubicacion_rango: ubicacion ? ubicacion.rango : "",
      ubicacion_resumen: ubicacion ? `${ubicacion.sede} • ${ubicacion.ambiente} • ${ubicacion.estante} • ${ubicacion.caja}` : "Pendiente de registro"
    };
  },

  search(filters = {}) {
    let list = this.getAll();

    // Búsqueda rápida de texto libre (busca por número, DNI, nombres, apellidos, asunto, expediente, área)
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const qDigits = q.replace(/[^\d]/g, "");

      list = list.filter(r => {
        const numDigits = String(r.numero_rd).replace(/[^\d]/g, "");
        const matchNum = qDigits && numDigits.includes(qDigits);
        const matchRd = r.numero_rd.toLowerCase().includes(q);
        const matchAsunto = r.asunto && r.asunto.toLowerCase().includes(q);
        const matchExp = r.expediente && r.expediente.toLowerCase().includes(q);
        const matchArea = r.area_origen && r.area_origen.toLowerCase().includes(q);
        const matchDni = r.administrado_dni && r.administrado_dni.includes(q);
        const matchName = r.administrado_nombre && r.administrado_nombre.toLowerCase().includes(q);

        return matchNum || matchRd || matchAsunto || matchExp || matchArea || matchDni || matchName;
      });
    }

    // Filtro por Número específico
    if (filters.numero && filters.numero.trim()) {
      const nDigits = filters.numero.replace(/[^\d]/g, "").trim();
      list = list.filter(r => String(r.numero_rd).replace(/[^\d]/g, "").includes(nDigits));
    }

    // Filtro por Año
    if (filters.anio && String(filters.anio).trim()) {
      list = list.filter(r => Number(r.anio) === Number(filters.anio));
    }

    // Filtro por DNI
    if (filters.dni && filters.dni.trim()) {
      const dClean = filters.dni.trim();
      list = list.filter(r => r.administrado_dni && r.administrado_dni.includes(dClean));
    }

    // Filtro por Administrado (nombres o apellidos)
    if (filters.administrado && filters.administrado.trim()) {
      const adm = filters.administrado.toLowerCase().trim();
      list = list.filter(r => r.administrado_nombre.toLowerCase().includes(adm));
    }

    // Filtro por Asunto
    if (filters.asunto && filters.asunto.trim()) {
      const as = filters.asunto.toLowerCase().trim();
      list = list.filter(r => r.asunto && r.asunto.toLowerCase().includes(as));
    }

    // Filtro por Expediente
    if (filters.expediente && filters.expediente.trim()) {
      const ex = filters.expediente.toLowerCase().trim();
      list = list.filter(r => r.expediente && r.expediente.toLowerCase().includes(ex));
    }

    // Filtro por Área de Origen
    if (filters.area && filters.area.trim()) {
      list = list.filter(r => r.area_origen === filters.area);
    }

    // Filtro por Estado
    if (filters.estado && filters.estado !== "TODOS") {
      list = list.filter(r => r.estado === filters.estado);
    }

    // Filtro por Documento Digital (DISPONIBLE o NO_DISPONIBLE)
    if (filters.documento && filters.documento !== "TODOS") {
      if (filters.documento === "DISPONIBLE" || filters.documento === "CON_PDF") {
        list = list.filter(r => r.tiene_documento);
      } else if (filters.documento === "NO_DISPONIBLE" || filters.documento === "SIN_PDF") {
        list = list.filter(r => !r.tiene_documento);
      }
    }

    // Filtro por Ubicación Física (CON_UBICACION o SIN_UBICACION o por Caja específica)
    if (filters.ubicacion && filters.ubicacion !== "TODOS") {
      if (filters.ubicacion === "CON_UBICACION") {
        list = list.filter(r => r.tiene_ubicacion);
      } else if (filters.ubicacion === "SIN_UBICACION") {
        list = list.filter(r => !r.tiene_ubicacion);
      } else {
        const uQuery = filters.ubicacion.toLowerCase().trim();
        list = list.filter(r => r.ubicacion && (
          (r.ubicacion.caja && r.ubicacion.caja.toLowerCase().includes(uQuery)) ||
          (r.ubicacion.sede && r.ubicacion.sede.toLowerCase().includes(uQuery))
        ));
      }
    }

    return list;
  },

  create(formData, currentUser = "Administrador") {
    // 1. Validar campos obligatorios
    if (!formData.numero_rd || !formData.numero_rd.trim()) {
      throw new Error("El número de Resolución Directoral es obligatorio.");
    }
    if (!formData.anio) {
      throw new Error("El año de emisión es obligatorio.");
    }
    if (!formData.fecha_emision) {
      throw new Error("La fecha de emisión es obligatoria.");
    }

    // 2. Crear o asociar administrado
    let administrado_id = null;
    if (formData.dni || formData.nombres || formData.apellidos) {
      const persona = personService.createOrGet({
        dni: formData.dni,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipo_persona: formData.tipo_persona || "Docente"
      });
      administrado_id = persona.id;
    }

    // 3. Crear o asociar ubicación física si se proporcionó
    let ubicacion_id = null;
    if (formData.caja && formData.caja.trim()) {
      const ubicacion = locationService.create({
        sede: formData.sede || "Sede Principal",
        ambiente: formData.ambiente || "Archivo",
        estante: formData.estante || "Estante A",
        archivador: formData.archivador || "Archivador 01",
        caja: formData.caja.trim(),
        rango: formData.rango || "",
        estado_archivo: formData.estado_archivo || "Archivado"
      });
      ubicacion_id = ubicacion.id;
    }

    // 4. Crear registro base de la resolución
    const today = new Date().toISOString().split("T")[0];
    const newRd = window.db.insert("resoluciones", {
      numero_rd: formData.numero_rd.trim(),
      anio: Number(formData.anio),
      fecha_emision: formData.fecha_emision,
      numero_proyecto: formData.numero_proyecto || "",
      administrado_id: administrado_id,
      asunto: formData.asunto || "",
      expediente: formData.expediente || "",
      area_origen: formData.area_origen || "Recursos Humanos",
      estado: formData.estado || "Registrado",
      fecha_notificacion: formData.fecha_notificacion || "",
      documento_id: null,
      ubicacion_id: ubicacion_id,
      fecha_registro: today,
      observaciones: formData.observaciones || ""
    });

    // 5. Crear documento digital si se seleccionó archivo demo
    if (formData.tiene_pdf) {
      const doc = documentService.create({
        resolucion_id: newRd.id,
        nombre_archivo: `${formData.numero_rd.trim()}.pdf`,
        numero_paginas: Number(formData.numero_paginas) || 4,
        tamanio: formData.tamanio || "1.5 MB",
        fecha_documento: formData.fecha_emision
      });
      window.db.update("resoluciones", newRd.id, { documento_id: doc.id });
      newRd.documento_id = doc.id;
    }

    // 6. Crear registro de notificación si corresponde
    if (formData.fecha_notificacion || formData.estado === "Notificado") {
      notificationService.create({
        resolucion_id: newRd.id,
        destinatario: formData.nombres ? `${formData.nombres} ${formData.apellidos}` : "Administrado",
        medio: formData.medio_notificacion || "Correo electrónico",
        fecha_notificacion: formData.fecha_notificacion || today,
        estado: formData.estado_notificacion || "Notificado"
      });
    }

    // 7. Trazabilidad inicial
    historyService.logAction({
      resolucion_id: newRd.id,
      accion: "Registro",
      descripcion: `Resolución ${newRd.numero_rd} registrada en el sistema.`,
      usuario: currentUser,
      estado_anterior: "",
      estado_nuevo: newRd.estado
    });

    return this.getById(newRd.id);
  },

  update(id, formData, currentUser = "Administrador") {
    const current = this.getById(id);
    if (!current) throw new Error("La resolución solicitada no existe.");

    const estadoAnterior = current.estado;

    // Actualizar persona
    if (formData.nombres || formData.apellidos || formData.dni) {
      if (current.administrado_id) {
        personService.createOrGet({
          id: current.administrado_id,
          dni: formData.dni,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          tipo_persona: formData.tipo_persona
        });
      } else {
        const p = personService.createOrGet({
          dni: formData.dni,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          tipo_persona: formData.tipo_persona
        });
        window.db.update("resoluciones", id, { administrado_id: p.id });
      }
    }

    // Actualizar o crear ubicación
    if (formData.caja && formData.caja.trim()) {
      if (current.ubicacion_id) {
        locationService.update(current.ubicacion_id, {
          sede: formData.sede,
          ambiente: formData.ambiente,
          estante: formData.estante,
          archivador: formData.archivador,
          caja: formData.caja.trim(),
          rango: formData.rango,
          estado_archivo: formData.estado_archivo || "Archivado"
        });
      } else {
        const u = locationService.create({
          sede: formData.sede,
          ambiente: formData.ambiente,
          estante: formData.estante,
          archivador: formData.archivador,
          caja: formData.caja.trim(),
          rango: formData.rango,
          estado_archivo: formData.estado_archivo || "Archivado"
        });
        window.db.update("resoluciones", id, { ubicacion_id: u.id });
      }
    }

    // Actualizar resolución
    const updates = {};
    if (formData.numero_rd) updates.numero_rd = formData.numero_rd.trim();
    if (formData.anio) updates.anio = Number(formData.anio);
    if (formData.fecha_emision) updates.fecha_emision = formData.fecha_emision;
    if (formData.numero_proyecto !== undefined) updates.numero_proyecto = formData.numero_proyecto;
    if (formData.asunto !== undefined) updates.asunto = formData.asunto;
    if (formData.expediente !== undefined) updates.expediente = formData.expediente;
    if (formData.area_origen) updates.area_origen = formData.area_origen;
    if (formData.estado) updates.estado = formData.estado;
    if (formData.fecha_notificacion !== undefined) updates.fecha_notificacion = formData.fecha_notificacion;
    if (formData.observaciones !== undefined) updates.observaciones = formData.observaciones;

    window.db.update("resoluciones", id, updates);

    // Trazabilidad de modificación
    historyService.logAction({
      resolucion_id: id,
      accion: "Modificación",
      descripcion: `Resolución editada por el usuario.`,
      usuario: currentUser,
      estado_anterior: estadoAnterior,
      estado_nuevo: formData.estado || estadoAnterior
    });

    return this.getById(id);
  },

  delete(id, currentUser = "Administrador") {
    const current = this.getById(id);
    if (!current) return false;

    // Registrar en trazabilidad antes de eliminar
    historyService.logAction({
      resolucion_id: id,
      accion: "Eliminación",
      descripcion: `Resolución ${current.numero_rd} eliminada del sistema.`,
      usuario: currentUser,
      estado_anterior: current.estado,
      estado_nuevo: "Eliminado"
    });

    return window.db.delete("resoluciones", id);
  },

  getStats() {
    const list = this.getAll();
    const currentYear = new Date().getFullYear();

    const total = list.length;
    const anioActual = list.filter(r => Number(r.anio) === currentYear).length;
    const conPdf = list.filter(r => r.tiene_documento).length;
    const pendientes = list.filter(r => r.estado === "Pendiente de notificación" || r.estado === "Registrado").length;
    const notificadas = list.filter(r => r.estado === "Notificado" || r.fecha_notificacion).length;
    const archivadas = list.filter(r => r.estado === "Archivado").length;

    // Distribución por año
    const porAnio = {};
    list.forEach(r => {
      porAnio[r.anio] = (porAnio[r.anio] || 0) + 1;
    });

    // Distribución por estado
    const porEstado = {};
    list.forEach(r => {
      porEstado[r.estado] = (porEstado[r.estado] || 0) + 1;
    });

    // Distribución por área
    const porArea = {};
    list.forEach(r => {
      const a = r.area_origen || "Otras";
      porArea[a] = (porArea[a] || 0) + 1;
    });

    return {
      total,
      anioActual,
      conPdf,
      sinPdf: total - conPdf,
      pendientes,
      notificadas,
      archivadas,
      porAnio,
      porEstado,
      porArea
    };
  }
};

// 8. SERVICIO DE SESIÓN Y AUTENTICACIÓN SIMULADA
const authService = {
  SESSION_KEY: "UGEL08_CURRENT_USER",

  getCurrentUser() {
    try {
      const saved = localStorage.getItem(this.SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      usuario: "admin",
      nombre: "Administrador del Sistema",
      rol: "Administrador"
    };
  },

  login(roleValue) {
    const users = window.db.getTable("usuarios");
    const user = users.find(u => u.usuario.toLowerCase() === roleValue.toLowerCase()) || users[0];
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  }
};

// Exportar globalmente
if (typeof window !== "undefined") {
  window.personService = personService;
  window.locationService = locationService;
  window.documentService = documentService;
  window.notificationService = notificationService;
  window.historyService = historyService;
  window.antecedentService = antecedentService;
  window.resolutionService = resolutionService;
  window.authService = authService;
}
