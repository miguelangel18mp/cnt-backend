const db = require('../config/db');

// Controlador para registrar desmontaje
const registrarDesmontaje = (req, res) => {
  const {
    tipo,
    capacidad,
    latitud_inicio,
    longitud_inicio,
    hora_inicio,
    foto_inicio,
    latitud_fin,
    longitud_fin,
    hora_fin,
    foto_fin
  } = req.body;

  const creado_por = req.usuario.id;

  // Validación básica
  if (!tipo || !capacidad || !latitud_inicio || !longitud_inicio || !hora_inicio || !foto_inicio ||
      !latitud_fin || !longitud_fin || !hora_fin || !foto_fin) {
    return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
  }

  const sql = `
    INSERT INTO desmontajes (
      tipo, capacidad, latitud_inicio, longitud_inicio, hora_inicio,
      foto_inicio, latitud_fin, longitud_fin, hora_fin, foto_fin, creado_por
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    tipo, capacidad, latitud_inicio, longitud_inicio, hora_inicio,
    foto_inicio, latitud_fin, longitud_fin, hora_fin, foto_fin, creado_por
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('❌ Error al registrar desmontaje:', err);
      return res.status(500).json({ mensaje: 'Error al registrar desmontaje' });
    }

    res.status(201).json({ mensaje: '✅ Desmontaje registrado correctamente' });
  });
};

module.exports = { registrarDesmontaje };

