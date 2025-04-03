const db = require('../config/db');

const obtenerLogs = (req, res) => {
  const sql = `SELECT logs.*, usuarios.nombre AS nombre_usuario 
               FROM logs 
               JOIN usuarios ON logs.usuario_id = usuarios.id 
               ORDER BY fecha DESC`;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error al obtener logs:', err);
      return res.status(500).json({ mensaje: 'Error al obtener los logs' });
    }

    res.json(resultados);
  });
};

module.exports = {
  obtenerLogs
};

