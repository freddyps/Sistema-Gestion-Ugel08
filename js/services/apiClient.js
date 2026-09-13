/**
 * CLIENTE API UNIFICADO PARA CONSUMO REST DEL SISTEMA UGEL 08
 * Comunicación directa con el backend Express (/api)
 */

const API_BASE = '/api';

const ApiService = {
  async getResoluciones(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/resoluciones${query ? '?' + query : ''}`);
    return await res.json();
  },

  async getResolucionById(id) {
    const res = await fetch(`${API_BASE}/resoluciones/${id}`);
    return await res.json();
  },

  async createResolucion(payload) {
    const res = await fetch(`${API_BASE}/resoluciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async getSolicitudes() {
    const res = await fetch(`${API_BASE}/solicitudes`);
    return await res.json();
  },

  async getSolicitudByCodigo(codigo) {
    const res = await fetch(`${API_BASE}/solicitudes/${codigo}`);
    return await res.json();
  },

  async updateSolicitudEstado(codigo, nuevoEstado) {
    const res = await fetch(`${API_BASE}/solicitudes/${codigo}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    return await res.json();
  },

  async getUbicaciones() {
    const res = await fetch(`${API_BASE}/ubicaciones`);
    return await res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return await res.json();
  }
};

window.ApiService = ApiService;
