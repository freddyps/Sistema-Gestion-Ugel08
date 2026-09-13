const store = require('../config/dataStore');

exports.getAll = (req, res) => {
  try {
    const list = store.getSolicitudes();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getByCodigo = (req, res) => {
  try {
    const item = store.getSolicitudByCodigo(req.params.codigo);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEstado = (req, res) => {
  try {
    const updated = store.updateSolicitudEstado(req.params.codigo, req.body.estado);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }
    res.json({ success: true, message: 'Estado actualizado', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
