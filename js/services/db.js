/**
 * CAPA DE ACCESO A DATOS (DATA ACCESS LAYER / DB SERVICE)
 * Maneja la persistencia en localStorage sin exponerlo directamente a la interfaz.
 * Permite reemplazar en el futuro las operaciones locales por llamadas API fetch/axios.
 */

const DB_KEY = "UGEL08_RD_DATABASE_V2";

const db = {
  _getStorage() {
    try {
      const data = localStorage.getItem(DB_KEY);
      if (!data) {
        this._initStorage();
        return JSON.parse(localStorage.getItem(DB_KEY));
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn("Error leyendo localStorage, reestableciendo datos semilla", e);
      this._initStorage();
      return window.SEED_DATA;
    }
  },

  _setStorage(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  },

  _initStorage() {
    if (typeof window.SEED_DATA !== "undefined") {
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
