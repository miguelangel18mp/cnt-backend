const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// LOGIN
const login = (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error interno del servidor' });
    if (resultados.length === 0) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

    const usuario = resultados[0];
    const passwordCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordCorrecta) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  });
};

// PERFIL
const perfil = (req, res) => {
  const usuario = req.usuario;
  res.json({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  });
};

// 🔁 Método antiguo de recuperación directa
const recuperarContraseña = async (req, res) => {
  const { email, nueva } = req.body;

  if (!email || !nueva) {
    return res.status(400).json({ mensaje: 'Email y nueva contraseña son requeridos' });
  }

  try {
    const hashed = await bcrypt.hash(nueva, 10);
    const sql = `UPDATE usuarios SET contraseña = ? WHERE email = ?`;

    db.query(sql, [hashed, email], (err, resultado) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar la contraseña' });
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
  }
};

// ✅ Solicitar recuperación por correo (envía token)
const solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ mensaje: 'Email es obligatorio' });

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el usuario' });
    if (resultados.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const usuario = resultados[0];
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const enlace = `http://localhost:5173/restablecer/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"CNT EP" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: '🔐 Recuperar contraseña',
      html: `
        <p>Hola ${usuario.nombre},</p>
        <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
        <p><a href="${enlace}" style="padding:10px 20px; background:#0070c0; color:#fff; text-decoration:none; border-radius:5px;">Restablecer Contraseña</a></p>
        <p>Este enlace expirará en 15 minutos.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `
    });

    res.json({ mensaje: '📩 Se ha enviado un enlace de recuperación a tu correo.' });
  });
};

// ✅ Restablecer con token (desde el enlace del correo)
const restablecerContraseña = async (req, res) => {
  const { token, nueva } = req.body;

  if (!token || !nueva) {
    return res.status(400).json({ mensaje: 'Token y nueva contraseña son requeridos' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(nueva, 10);

    const sql = `UPDATE usuarios SET contraseña = ? WHERE id = ?`;
    db.query(sql, [hashed, decoded.id], (err, resultado) => {
      if (err) return res.status(500).json({ mensaje: 'Error al actualizar la contraseña' });
      if (resultado.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      res.json({ mensaje: '✅ Contraseña restablecida correctamente' });
    });
  } catch (err) {
    return res.status(400).json({ mensaje: '❌ Token inválido o expirado' });
  }
};

module.exports = {
  login,
  perfil,
  recuperarContraseña,
  solicitarRecuperacion,
  restablecerContraseña
};




