const express = require('express');
const router = express.Router();

const {
  ingresarCable,
  listarCables,
  editarCable,
  eliminarCable
} = require('../controllers/cablesController');

// Importar middleware de verificación de token y roles
const verifyToken = require('../middlewares/verifyToken');

// ✅ Ingresar un cable – SOLO técnico
router.post('/', verifyToken(['tecnico']), ingresarCable);

// ✅ Listar cables – SOLO bodeguero y administrador
router.get('/', verifyToken(['bodeguero', 'administrador']), listarCables);

// ✅ Editar cable – SOLO bodeguero y administrador
router.put('/:id', verifyToken(['bodeguero', 'administrador']), editarCable);

// ✅ Eliminar cable – SOLO bodeguero y administrador
router.delete('/:id', verifyToken(['bodeguero', 'administrador']), eliminarCable);

module.exports = router;




