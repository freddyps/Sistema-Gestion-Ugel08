const store = require('../config/dataStore');

exports.getAll = (req, res) => {
  try {
    const list = store.getUbicaciones();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getStats = (req, res) => {
  try {
    const stats = store.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
