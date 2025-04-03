const express = require('express');
const router = express.Router();

const {
  login,
  perfil,
  recuperarContraseña,         // ← método clásico (opcional)
  solicitarRecuperacion,       // ← ✅ NUEVO: envío de link al correo
  restablecerContraseña        // ← ✅ NUEVO: restablecer con token
} = require('../controllers/authController');

const verifyToken = require('../middlewares/verifyToken');

// 🔐 Login
router.post('/login', login);

// 👤 Perfil autenticado
router.get('/perfil', verifyToken(), perfil);

// 🔁 Recuperación directa (antigua) – puedes eliminar si ya no la usas
router.put('/recuperar', recuperarContraseña);

// ✉️ Solicitar recuperación (envía link al correo)
router.post('/solicitar-recuperacion', solicitarRecuperacion);

// 🔐 Restablecer contraseña con token
router.post('/restablecer/:token', restablecerContraseña);

module.exports = router;



