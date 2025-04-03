const db = require('../config/db');

const obtenerNotificaciones = (req, res) => {
  const usuario_id = req.params.usuario_id;

  const sql = `SELECT * FROM notificaciones 
               WHERE usuario_id = ? 
               ORDER BY fecha DESC`;

  db.query(sql, [usuario_id], (err, resultados) => {
    if (err) {
      console.error('Error al obtener notificaciones:', err);
      return res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
    }

    res.json(resultados);
  });
};

module.exports = {
  obtenerNotificaciones
};
