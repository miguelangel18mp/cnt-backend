const express = require('express');
const router = express.Router();
const { obtenerNotificaciones } = require('../controllers/notificacionesController');

// Obtener notificaciones por usuario
router.get('/:usuario_id', obtenerNotificaciones);

module.exports = router;

