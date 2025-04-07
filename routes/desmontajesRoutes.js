const express = require('express');
const router = express.Router();
const { registrarDesmontaje } = require('../controllers/desmontajesController');
const verifyToken = require('../middlewares/verifyToken');

// Ruta protegida para registrar desmontaje
router.post('/', verifyToken(), registrarDesmontaje);

module.exports = router;

