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
  _cachedAll: null,

  _invalidateCache() {
    this._cachedAll = null;
  },

  getAll() {
    if (this._cachedAll) {
      return this._cachedAll;
    }
    const rawResoluciones = window.db.getTable("resoluciones");
    
    // Precargar entidades relacionadas en Maps para O(1) lookup en vez de find() O(N) por cada registro
    const personasMap = new Map((window.db.getTable("personas") || []).map(p => [Number(p.id), p]));
    const ubicacionesMap = new Map((window.db.getTable("ubicaciones") || []).map(u => [Number(u.id), u]));
    const documentosMap = new Map((window.db.getTable("documentos") || []).map(d => [Number(d.id), d]));

    this._cachedAll = rawResoluciones.map(r => {
      const persona = r.administrado_id ? personasMap.get(Number(r.administrado_id)) : null;
      const ubicacion = r.ubicacion_id ? ubicacionesMap.get(Number(r.ubicacion_id)) : null;
      const documento = r.documento_id ? documentosMap.get(Number(r.documento_id)) : null;

      return {
        ...r,
        persona,
        ubicacion,
        documento,
        administrado_nombre: persona ? `${persona.nombres} ${persona.apellidos}`.trim() : "No registrado",
        administrado_dni: persona ? persona.dni : "",
        tiene_documento: Boolean(documento && documento.estado === "Disponible"),
        tiene_ubicacion: Boolean(ubicacion && ubicacion.caja),
        ubicacion_caja: ubicacion ? ubicacion.caja : "Sin ubicación",
        ubicacion_rango: ubicacion ? ubicacion.rango : "",
        ubicacion_resumen: ubicacion ? `${ubicacion.sede} • ${ubicacion.ambiente} • ${ubicacion.estante} • ${ubicacion.caja}` : "Pendiente de registro"
      };
    });

    return this._cachedAll;
  },

  getById(id) {
    const all = this.getAll();
    return all.find(r => Number(r.id) === Number(id)) || null;
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
    return this.getById(r.id) || r;
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

    this._invalidateCache();
    return this.getById(newRd.id);
  },

  update(id, formData, currentUser = "Administrador") {
    this._invalidateCache();
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

  // Flujo María Angélica: Remitir Resolución a Archivo
  remitirAArchivo(id, observacion = "") {
    const res = this.getById(id);
    if (!res) throw new Error("Resolución no encontrada.");

    const currentUser = window.authService ? window.authService.getCurrentUser().nombre : "María Angélica Sánchez";
    const estadoAnterior = res.estado;
    const nuevoEstado = "Pendiente de archivo";
    const now = new Date();
    const fechaHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    window.db.update("resoluciones", id, {
      estado: nuevoEstado,
      remitido_a_archivo: true,
      fecha_remision_archivo: fechaHora,
      remitido_por: currentUser,
      observacion_remision: observacion
    });

    historyService.logAction({
      resolucion_id: id,
      accion: "Remisión a Archivo",
      descripcion: `Resolución ${res.numero_rd} remitida formalmente al área de Archivo Central por ${currentUser}. ${observacion}`,
      usuario: currentUser,
      estado_anterior: estadoAnterior,
      estado_nuevo: nuevoEstado
    });

    this._invalidateCache();
    return this.getById(id);
  },

  // Flujo Marcos: Confirmar recepción física en Archivo
  recibirEnArchivo(id, observacion = "") {
    const res = this.getById(id);
    if (!res) throw new Error("Resolución no encontrada.");

    const currentUser = window.authService ? window.authService.getCurrentUser().nombre : "Marcos Huamán (Archivo)";
    const estadoAnterior = res.estado;
    const nuevoEstado = "Recibida en archivo";
    const now = new Date();
    const fechaHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    window.db.update("resoluciones", id, {
      estado: nuevoEstado,
      recibido_en_archivo: true,
      fecha_recepcion_archivo: fechaHora,
      recibido_por: currentUser,
      observacion_recepcion: observacion
    });

    historyService.logAction({
      resolucion_id: id,
      accion: "Recepción Física en Archivo",
      descripcion: `Documento autógrafo de Resolución ${res.numero_rd} recibido físicamente en Archivo por ${currentUser}. ${observacion}`,
      usuario: currentUser,
      estado_anterior: estadoAnterior,
      estado_nuevo: nuevoEstado
    });

    this._invalidateCache();
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

    this._invalidateCache();
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
  },

  // Validación granular de permisos por rol
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Administrador posee permiso universal
    if (user.rol === "Administrador" || user.usuario === "admin") return true;

    const roles = window.db.getTable("roles");
    const userRole = roles.find(r => r.nombre.toLowerCase().includes(user.rol.toLowerCase()) || r.codigo.toLowerCase() === user.usuario.toLowerCase());

    if (!userRole) return false;
    if (userRole.permisos.includes("*")) return true;

    return userRole.permisos.includes(permission);
  },

  // Obtener definición de navegación exclusiva para el usuario logueado
  getMenuForCurrentUser() {
    const user = this.getCurrentUser();
    const rol = (user && user.rol) ? user.rol.toLowerCase() : "administrador";

    // 1. ADMINISTRADOR
    if (rol.includes("administrador") || (user && user.usuario === "admin")) {
      return {
        roleKey: "admin",
        roleTitle: "Administrador del Sistema",
        items: [
          { key: "dashboard", label: "Inicio", url: "dashboard.html", icon: "home" },
          { 
            key: "resoluciones", 
            label: "Resoluciones", 
            url: "resoluciones.html", 
            icon: "document",
            subitems: [
              { key: "resoluciones-lista", label: "Gestión de Resoluciones", url: "resoluciones.html", icon: "document" },
              { key: "registrar-rd", label: "Registrar Resolución", url: "registrar-resolucion.html", icon: "plus" },
              { key: "notificaciones", label: "Notificaciones", url: "notificaciones.html", icon: "bell" },
              { key: "archivo", label: "Archivo Físico", url: "ubicacion.html", icon: "archive" },
              { key: "usuarios", label: "Usuarios del Sistema", url: "usuarios.html", icon: "users" },
              { key: "roles", label: "Roles y Permisos", url: "roles-permisos.html", icon: "shield" },
              { key: "catalogos", label: "Catálogos / Config.", url: "configuracion.html", icon: "cog" },
              { key: "reportes", label: "Reportes Estadísticos", url: "reportes.html", icon: "chart" },
              { key: "auditoria", label: "Auditoría / Historial", url: "auditoria.html", icon: "clock" }
            ]
          }
        ]
      };
    }

    // 2. MARÍA ANGÉLICA — OFICINA DE RESOLUCIONES
    if (rol.includes("resoluciones") || (user && user.usuario === "maria")) {
      return {
        roleKey: "maria",
        roleTitle: "Oficina de Resoluciones — María Angélica",
        items: [
          { key: "dashboard", label: "Inicio", url: "dashboard.html", icon: "home" },
          { 
            key: "resoluciones", 
            label: "Resoluciones", 
            url: "resoluciones.html", 
            icon: "document",
            subitems: [
              { key: "registrar-rd", label: "Registrar Resolución", url: "resoluciones.html?nueva=1", icon: "plus" },
              { key: "resoluciones-lista", label: "Búsqueda y Gestión RD", url: "resoluciones.html", icon: "document" },
              { key: "documentos", label: "Documentos Digitales", url: "resoluciones.html?doc=DISPONIBLE", icon: "file-text" },
              { key: "notificaciones", label: "Control de Notificaciones", url: "resoluciones.html?estado=Pendiente+de+notificaci%C3%B3n", icon: "bell" },
              { key: "historial", label: "Historial de Emisiones", url: "auditoria.html?filtro=resoluciones", icon: "clock" }
            ]
          }
        ]
      };
    }

    // 3. MARCOS — ARCHIVO
    return {
      roleKey: "marcos",
      roleTitle: "Archivo Central — Marcos",
      items: [
        { key: "dashboard", label: "Inicio", url: "dashboard.html", icon: "home" },
        { 
          key: "resoluciones", 
          label: "Resoluciones", 
          url: "resoluciones.html", 
          icon: "document",
          subitems: [
            { key: "recibidas", label: "Resoluciones Recibidas", url: "recepcion-archivo.html", icon: "inbox" },
            { key: "resoluciones-lista", label: "Consulta de Resoluciones", url: "resoluciones.html", icon: "document" },
            { key: "ubicacion", label: "Ubicación Física (Cajas)", url: "ubicacion.html", icon: "archive" },
            { key: "localizar", label: "Buscar / Localizar", url: "ubicacion.html?modo=localizar", icon: "search" },
            { key: "historial", label: "Historial de Custodia", url: "auditoria.html?filtro=archivo", icon: "clock" }
          ]
        }
      ]
    };
  }
};

// 9. SERVICIO DE SOLICITUDES DE COPIAS Y ANTECEDENTES (Lógica de Negocio)
const requestService = {
  getAll() {
    return window.db.getTable("solicitudes");
  },

  getByCodigo(codigo) {
    if (!codigo) return null;
    const list = this.getAll();
    const cleanCod = String(codigo).trim().toLowerCase();
    return list.find(s => s.codigo.toLowerCase() === cleanCod || s.codigo.toLowerCase().includes(cleanCod)) || null;
  },

  getById(id) {
    return window.db.getById("solicitudes", id);
  },

  // Reglas de negocio institucionales para cambio de estado
  updateEstado(codigo, nuevoEstado, observacion = "") {
    const solicitud = this.getByCodigo(codigo);
    if (!solicitud) {
      throw new Error(`Solicitud con código ${codigo} no encontrada.`);
    }

    const estadoAnterior = solicitud.estado;
    const validStates = ["PENDIENTE", "DOCUMENTO LOCALIZADO", "DOCUMENTO PREPARADO", "ATENDIDA", "OBSERVADA"];
    const estadoUpper = nuevoEstado.toUpperCase();

    if (!validStates.includes(estadoUpper)) {
      throw new Error(`Estado ${nuevoEstado} no es válido en el flujo de solicitudes.`);
    }

    const updated = window.db.update("solicitudes", solicitud.id, {
      estado: estadoUpper,
      observacion_estado: observacion || solicitud.observacion_estado || ""
    });

    // Auditoría en historial institucional si existe resolución asociada
    if (solicitud.rd_solicitada && window.historyService) {
      const res = window.resolutionService ? window.resolutionService.findByNumero(solicitud.rd_solicitada) : null;
      if (res) {
        window.historyService.logAction({
          resolucion_id: res.id,
          accion: "Atención de Solicitud",
          descripcion: `Solicitud ${codigo} pasó de ${estadoAnterior} a ${estadoUpper}. ${observacion}`,
          usuario: window.authService ? window.authService.getCurrentUser().nombre : "Personal UGEL 08",
          estado_anterior: estadoAnterior,
          estado_nuevo: estadoUpper
        });
      }
    }

    return updated;
  },

  filter(filters = {}) {
    let list = this.getAll();

    if (filters.estado && filters.estado !== "TODOS") {
      list = list.filter(s => s.estado.toUpperCase() === filters.estado.toUpperCase());
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(s =>
        s.codigo.toLowerCase().includes(q) ||
        (s.solicitante && s.solicitante.toLowerCase().includes(q)) ||
        (s.dni && s.dni.includes(q)) ||
        (s.rd_solicitada && s.rd_solicitada.toLowerCase().includes(q)) ||
        (s.tipo && s.tipo.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getStats() {
    const list = this.getAll();
    return {
      total: list.length,
      pendientes: list.filter(s => s.estado === "PENDIENTE").length,
      localizadas: list.filter(s => s.estado === "DOCUMENTO LOCALIZADO").length,
      atendidas: list.filter(s => s.estado === "ATENDIDA").length,
      preparadas: list.filter(s => s.estado === "DOCUMENTO PREPARADO").length
    };
  }
};

// 10. SERVICIO DE ENTREGAS DIGITALES Y CARGOS (Lógica de Negocio)
const deliveryService = {
  getAll() {
    return window.db.getTable("entregas");
  },

  getByCodigo(codigo) {
    if (!codigo) return null;
    const list = this.getAll();
    const cleanCod = String(codigo).trim().toLowerCase();
    return list.find(e => e.codigo.toLowerCase() === cleanCod || e.codigo.toLowerCase().includes(cleanCod)) || null;
  },

  // Generación formal de entrega digital aplicando reglas de negocio
  createDelivery({ solicitudCodigo, solicitante, resolucion, documentos, vigenciaDias = 7, medio = "Enlace Seguro / WhatsApp" }) {
    if (!solicitante || !resolucion) {
      throw new Error("El solicitante y la resolución son obligatorios para generar una entrega institucional.");
    }

    const docs = Array.isArray(documentos) ? documentos : [];
    if (docs.length === 0) {
      throw new Error("Debe incluir al menos un documento digital autorizado en la entrega.");
    }

    // Cálculo de folios y peso digital
    let totalPags = 0;
    let totalMB = 0;

    docs.forEach(d => {
      totalPags += Number(d.paginas) || 1;
      const mbVal = parseFloat(d.tamano) || 1;
      if (String(d.tamano).includes('KB')) {
        totalMB += mbVal / 1024;
      } else {
        totalMB += mbVal;
      }
    });

    const pesoFormatted = totalMB >= 1 ? `${totalMB.toFixed(1)} MB` : `${Math.round(totalMB * 1024)} KB`;

    // Fechas institucionales con vigencia
    const hoy = new Date();
    const venc = new Date();
    venc.setDate(hoy.getDate() + Number(vigenciaDias));

    const pad = n => String(n).padStart(2, '0');
    const fHoy = `${pad(hoy.getDate())}/${pad(hoy.getMonth() + 1)}/${hoy.getFullYear()}`;
    const fVenc = `${pad(venc.getDate())}/${pad(venc.getMonth() + 1)}/${venc.getFullYear()}`;

    // Generar código institucional seguro ENT-2026-XXXXXX
    const randomSuffix = Math.floor(Math.random() * 900000) + 100000;
    const nuevoCodigo = `ENT-${hoy.getFullYear()}-${randomSuffix}`;
    const enlaceSeguro = `https://sistema-demo-ugel.gob.pe/documentos/${nuevoCodigo}`;

    const nuevaEntrega = window.db.insert("entregas", {
      codigo: nuevoCodigo,
      solicitud_codigo: solicitudCodigo || "TRAMITE-DIRECTO",
      solicitante,
      resolucion,
      documentos: docs.map(d => ({
        nombre: d.nombre,
        paginas: d.paginas,
        tamano: d.tamano
      })),
      total_documentos: docs.length,
      total_paginas: totalPags,
      total_peso: pesoFormatted,
      fecha_creacion: fHoy,
      fecha_vencimiento: fVenc,
      medio,
      estado: "DISPONIBLE",
      accesos: 0,
      enlace: enlaceSeguro
    });

    // Si provenía de una solicitud formal, actualizar su estado en el flujo institucional
    if (solicitudCodigo && solicitudCodigo !== "TRAMITE-DIRECTO") {
      try {
        requestService.updateEstado(solicitudCodigo, "ATENDIDA", `Entrega digital generada con código ${nuevoCodigo}`);
      } catch (e) {
        console.warn("No se pudo actualizar estado de solicitud vinculada", e);
      }
    }

    return nuevaEntrega;
  },

  registerAccess(codigo) {
    const entrega = this.getByCodigo(codigo);
    if (!entrega) return null;
    const currentAccesos = Number(entrega.accesos) || 0;
    return window.db.update("entregas", entrega.id, {
      accesos: currentAccesos + 1,
      ultimo_acceso: new Date().toISOString()
    });
  },

  search(query) {
    const list = this.getAll();
    if (!query) return list;
    const q = query.toLowerCase().trim();
    return list.filter(e =>
      e.codigo.toLowerCase().includes(q) ||
      (e.solicitante && e.solicitante.toLowerCase().includes(q)) ||
      (e.resolucion && e.resolucion.toLowerCase().includes(q)) ||
      (e.medio && e.medio.toLowerCase().includes(q))
    );
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
  window.requestService = requestService;
  window.deliveryService = deliveryService;
}
