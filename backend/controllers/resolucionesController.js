const store = require('../config/dataStore');

exports.getAll = (req, res) => {
  try {
    const list = store.getResoluciones(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const item = store.getResolucionById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Resolución no encontrada' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.create = (req, res) => {
  try {
    if (!req.body.numero || !req.body.asunto) {
      return res.status(400).json({ success: false, message: 'Número y asunto son obligatorios' });
    }
    const created = store.createResolucion(req.body);
    res.status(201).json({ success: true, message: 'Resolución registrada exitosamente', data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
