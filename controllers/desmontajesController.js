const db = require('../config/db');

// 🚧 1. Registrar inicio del desmontaje
const registrarInicioDesmontaje = (req, res) => {
  const {
    tipo,
    capacidad,
    latitud_inicio,
    longitud_inicio,
    hora_inicio,
    foto_inicio
  } = req.body;

  const creado_por = req.usuario.id;

  if (!tipo || !capacidad || !latitud_inicio || !longitud_inicio || !hora_inicio || !foto_inicio) {
    return res.status(400).json({ mensaje: 'Todos los campos de inicio son requeridos' });
  }

  const sql = `
    INSERT INTO desmontajes (
      tipo, capacidad, latitud_inicio, longitud_inicio, hora_inicio, foto_inicio, creado_por
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    tipo, capacidad, latitud_inicio, longitud_inicio, hora_inicio, foto_inicio, creado_por
  ];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error('❌ Error al registrar inicio:', err);
      return res.status(500).json({ mensaje: 'Error al registrar inicio de desmontaje' });
    }

    res.status(201).json({ mensaje: '✅ Inicio de desmontaje registrado correctamente' });
  });
};

// ✅ 2. Finalizar desmontaje
const finalizarDesmontaje = (req, res) => {
  const {
    latitud_fin,
    longitud_fin,
    hora_fin,
    foto_fin
  } = req.body;

  const usuarioId = req.usuario.id;

  if (!latitud_fin || !longitud_fin || !hora_fin || !foto_fin) {
    return res.status(400).json({ mensaje: 'Todos los campos de finalización son requeridos' });
  }

  const queryBuscar = `
    SELECT id FROM desmontajes
    WHERE creado_por = ? AND hora_fin IS NULL
    ORDER BY creado_en DESC LIMIT 1
  `;

  db.query(queryBuscar, [usuarioId], (err, resultados) => {
    if (err) {
      console.error('❌ Error al buscar desmontaje sin finalizar:', err);
      return res.status(500).json({ mensaje: 'Error al buscar desmontaje pendiente' });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'No hay desmontaje pendiente por finalizar' });
    }

    const desmontajeId = resultados[0].id;

    const sqlActualizar = `
      UPDATE desmontajes SET
        latitud_fin = ?, longitud_fin = ?, hora_fin = ?, foto_fin = ?
      WHERE id = ?
    `;

    const valores = [latitud_fin, longitud_fin, hora_fin, foto_fin, desmontajeId];

    db.query(sqlActualizar, valores, (err) => {
      if (err) {
        console.error('❌ Error al finalizar desmontaje:', err);
        return res.status(500).json({ mensaje: 'Error al finalizar desmontaje' });
      }

      res.json({ mensaje: '✅ Desmontaje finalizado correctamente' });
    });
  });
};

// 📄 3. Obtener desmontajes (para administrador/bodeguero)
const obtenerDesmontajes = (req, res) => {
  const sql = `
    SELECT d.*, u.nombre AS nombre_usuario
    FROM desmontajes d
    JOIN usuarios u ON d.creado_por = u.id
    ORDER BY d.creado_en DESC
  `;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Error al obtener desmontajes:', err);
      return res.status(500).json({ mensaje: 'Error al obtener desmontajes' });
    }

    res.json(resultados);
  });
};

module.exports = {
  registrarInicioDesmontaje,
  finalizarDesmontaje,
  obtenerDesmontajes
};


