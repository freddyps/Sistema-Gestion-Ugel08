const express = require('express');
const router = express.Router();
const resolucionesCtrl = require('../controllers/resolucionesController');
const solicitudesCtrl = require('../controllers/solicitudesController');
const ubicacionesCtrl = require('../controllers/ubicacionesController');

// Resoluciones
router.get('/resoluciones', resolucionesCtrl.getAll);
router.get('/resoluciones/:id', resolucionesCtrl.getById);
router.post('/resoluciones', resolucionesCtrl.create);

// Solicitudes
router.get('/solicitudes', solicitudesCtrl.getAll);
router.get('/solicitudes/:codigo', solicitudesCtrl.getByCodigo);
router.patch('/solicitudes/:codigo/estado', solicitudesCtrl.updateEstado);

// Ubicaciones & Dashboard Stats
router.get('/ubicaciones', ubicacionesCtrl.getAll);
router.get('/stats', ubicacionesCtrl.getStats);

module.exports = router;
