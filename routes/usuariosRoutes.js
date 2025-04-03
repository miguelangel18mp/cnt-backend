const express = require('express');
const router = express.Router();

const {
  registrarUsuario,
  listarUsuarios,
  listarUsuariosInactivos, // ✅ NUEVO
  cambiarContraseña,
  editarUsuario,
  eliminarUsuario,
  activarUsuario
} = require('../controllers/usuariosController');

const verifyToken = require('../middlewares/verifyToken');

// 👉 Registrar usuario (puedes protegerlo si deseas)
router.post('/', registrarUsuario);

// 🔒 Listar usuarios activos – SOLO para administrador
router.get('/', verifyToken(['administrador']), listarUsuarios);

// 🔒 Listar usuarios inactivos – SOLO para administrador
router.get('/inactivos', verifyToken(['administrador']), listarUsuariosInactivos);

// 🔒 Cambiar contraseña – cualquier usuario autenticado
router.put('/cambiar-contraseña', verifyToken(), cambiarContraseña);

// 🔒 Editar usuario – SOLO para administrador
router.put('/:id', verifyToken(['administrador']), editarUsuario);

// 🔒 Eliminar usuario (marcar como inactivo) – SOLO para administrador
router.delete('/:id', verifyToken(['administrador']), eliminarUsuario);

// 🔒 Activar usuario (estado = ACTIVO) – SOLO para administrador
router.put('/:id/activar', verifyToken(['administrador']), activarUsuario);

module.exports = router;




