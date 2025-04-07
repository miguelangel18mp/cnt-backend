const express = require('express');
const router = express.Router();
const {
  registrarInicioDesmontaje,
  finalizarDesmontaje
} = require('../controllers/desmontajesController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken(), registrarInicioDesmontaje); // inicio
router.put('/finalizar', verifyToken(), finalizarDesmontaje); // finalización

module.exports = router;

