const express = require('express');
const router = express.Router();
const { obtenerLogs } = require('../controllers/logsController');

// Ruta para obtener todos los logs
router.get('/', obtenerLogs);

module.exports = router;
