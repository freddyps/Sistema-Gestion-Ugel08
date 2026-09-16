/**
 * CAPA DE ACCESO A DATOS (DATA ACCESS LAYER / DB SERVICE)
 * Maneja la persistencia en localStorage sin exponerlo directamente a la interfaz.
 * Permite reemplazar en el futuro las operaciones locales por llamadas API fetch/axios.
 */

const DB_KEY = "UGEL08_RD_DATABASE_V2";

const db = {
  _cache: null,

  _getStorage() {
    if (this._cache) {
      return this._cache;
    }
    try {
      const data = localStorage.getItem(DB_KEY);
      if (!data) {
        this._initStorage();
        this._cache = JSON.parse(localStorage.getItem(DB_KEY));
        return this._cache;
      }
      const parsed = JSON.parse(data);
      // Auto-migración si faltan colecciones agregadas recientemente en SEED_DATA
      if (typeof window.SEED_DATA !== "undefined") {
        let modified = false;
        // Asegurar que usuarios contenga los 3 perfiles oficiales y roles actualizados
        if (!parsed.usuarios || parsed.usuarios.length !== window.SEED_DATA.usuarios.length) {
          parsed.usuarios = [...window.SEED_DATA.usuarios];
          parsed.roles = [...window.SEED_DATA.roles];
          modified = true;
        } else if (!parsed.roles || parsed.roles.some(r => r.permisos && !r.permisos.includes("reportes.ver") && !r.permisos.includes("*"))) {
          parsed.roles = [...window.SEED_DATA.roles];
          modified = true;
        }
        for (const col of ["solicitudes", "entregas", "roles"]) {
          if (!parsed[col] && window.SEED_DATA[col]) {
            parsed[col] = [...window.SEED_DATA[col]];
            modified = true;
          }
        }
        if (modified) {
          this._setStorage(parsed);
        }
      }
      this._cache = parsed;
      return this._cache;
    } catch (e) {
      console.warn("Error leyendo localStorage, reestableciendo datos semilla", e);
      this._initStorage();
      this._cache = window.SEED_DATA;
      return this._cache;
    }
  },

  _setStorage(data) {
    this._cache = data;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  },

  _initStorage() {
    if (typeof window.SEED_DATA !== "undefined") {
      this._cache = window.SEED_DATA;
      localStorage.setItem(DB_KEY, JSON.stringify(window.SEED_DATA));
    }
  },

  resetDatabase() {
    this._initStorage();
  },

  // Operaciones genéricas sobre colecciones
  getTable(tableName) {
    const store = this._getStorage();
    return store[tableName] ? [...store[tableName]] : [];
  },

  getById(tableName, id) {
    const list = this.getTable(tableName);
    return list.find(item => Number(item.id) === Number(id)) || null;
  },

  insert(tableName, item) {
    const store = this._getStorage();
    if (!store[tableName]) store[tableName] = [];
    
    // Asignar ID incremental
    const maxId = store[tableName].reduce((max, cur) => Math.max(max, Number(cur.id) || 0), 0);
    const newRecord = { ...item, id: maxId + 1 };
    
    store[tableName].unshift(newRecord);
    this._setStorage(store);
    return newRecord;
  },

  update(tableName, id, updates) {
    const store = this._getStorage();
    if (!store[tableName]) return null;
    
    const index = store[tableName].findIndex(item => Number(item.id) === Number(id));
    if (index === -1) return null;
    
    store[tableName][index] = { ...store[tableName][index], ...updates };
    this._setStorage(store);
    return store[tableName][index];
  },

  delete(tableName, id) {
    const store = this._getStorage();
    if (!store[tableName]) return false;
    
    const initialLen = store[tableName].length;
    store[tableName] = store[tableName].filter(item => Number(item.id) !== Number(id));
    this._setStorage(store);
    return store[tableName].length < initialLen;
  }
};

if (typeof window !== "undefined") {
  window.db = db;
}
