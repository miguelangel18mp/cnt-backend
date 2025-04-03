const db = require('../config/db');

// INGRESAR CABLE
const ingresarCable = (req, res) => {
  const { tipo, capacidad, metraje, latitud, longitud, ingresado_por } = req.body;

  if (!tipo || !capacidad || !metraje || !latitud || !longitud || !ingresado_por) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const sql = `INSERT INTO cables (tipo, capacidad, metraje, latitud, longitud, ingresado_por)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [tipo, capacidad, metraje, latitud, longitud, ingresado_por], (err, resultado) => {
    if (err) {
      console.error('Error al ingresar cable:', err);
      return res.status(500).json({ mensaje: 'Error al ingresar el cable' });
    }

    const notificacion = `Cable tipo ${tipo} ingresado correctamente`;

    db.query(
      `INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)`,
      [ingresado_por, notificacion]
    );

    db.query(
      `INSERT INTO logs (usuario_id, accion, descripcion) VALUES (?, 'INGRESO', ?)`,
      [ingresado_por, notificacion]
    );

    res.status(201).json({ mensaje: 'Cable ingresado correctamente' });
  });
};

// LISTAR CABLES
const listarCables = (req, res) => {
  const sql = `SELECT c.*, u.nombre AS nombre_usuario
               FROM cables c
               JOIN usuarios u ON c.ingresado_por = u.id`;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error al obtener cables:', err);
      return res.status(500).json({ mensaje: 'Error al obtener los cables' });
    }

    res.json(resultados);
  });
};

// EDITAR CABLE
const editarCable = (req, res) => {
  const id = req.params.id;
  const { tipo, capacidad, metraje, latitud, longitud, estado, editado_por } = req.body;

  if (!tipo || !capacidad || !metraje || !latitud || !longitud || !estado || !editado_por) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const sql = `UPDATE cables 
               SET tipo = ?, capacidad = ?, metraje = ?, latitud = ?, longitud = ?, estado = ?
               WHERE id = ?`;

  db.query(sql, [tipo, capacidad, metraje, latitud, longitud, estado, id], (err, resultado) => {
    if (err) {
      console.error('Error al editar el cable:', err);
      return res.status(500).json({ mensaje: 'Error al editar el cable' });
    }

    const logMensaje = `Se editó el cable ID ${id}`;
    db.query(
      `INSERT INTO logs (usuario_id, accion, descripcion) VALUES (?, 'EDICION', ?)`,
      [editado_por, logMensaje]
    );

    res.json({ mensaje: 'Cable editado correctamente' });
  });
};

// ELIMINAR (CAMBIO DE ESTADO A INACTIVO)
const eliminarCable = (req, res) => {
  const id = req.params.id;
  const { eliminado_por } = req.body;

  if (!eliminado_por) {
    return res.status(400).json({ mensaje: 'Falta el ID del usuario que elimina' });
  }

  const sql = `UPDATE cables SET estado = 'INACTIVO' WHERE id = ?`;

  db.query(sql, [id], (err, resultado) => {
    if (err) {
      console.error('Error al eliminar cable:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar cable' });
    }

    const descripcion = `Cable ID ${id} marcado como INACTIVO`;
    db.query(
      `INSERT INTO logs (usuario_id, accion, descripcion) VALUES (?, 'ELIMINACION', ?)`,
      [eliminado_por, descripcion]
    );

    res.json({ mensaje: 'Cable marcado como inactivo correctamente' });
  });
};

// EXPORTAR TODAS LAS FUNCIONES
module.exports = {
  ingresarCable,
  listarCables,
  editarCable,
  eliminarCable
};



