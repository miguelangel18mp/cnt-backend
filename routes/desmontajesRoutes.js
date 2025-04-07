const express = require('express');
const router = express.Router();
const {
  registrarInicioDesmontaje,
  finalizarDesmontaje,
  obtenerDesmontajes // ✅ IMPORTAMOS EL CONTROLADOR PARA LISTAR
} = require('../controllers/desmontajesController');
const verifyToken = require('../middlewares/verifyToken');

// Ruta para registrar el inicio del desmontaje
router.post('/', verifyToken(), registrarInicioDesmontaje);

// Ruta para finalizar el desmontaje
router.put('/finalizar', verifyToken(), finalizarDesmontaje);

// ✅ Ruta para obtener todos los desmontajes
router.get('/', verifyToken(), obtenerDesmontajes);

module.exports = router;


