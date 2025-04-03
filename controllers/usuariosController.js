const db = require('../config/db');
const bcrypt = require('bcryptjs');

// REGISTRO DE USUARIO
const registrarUsuario = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;

  if (!nombre || !email || !contraseña || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const rolesPermitidos = ['tecnico', 'bodeguero', 'administrador'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ mensaje: 'Rol no válido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const sql = `INSERT INTO usuarios (nombre, email, contraseña, rol, estado)
                 VALUES (?, ?, ?, ?, 'ACTIVO')`;

    db.query(sql, [nombre, email, hashedPassword, rol], (err) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ mensaje: 'Error al registrar el usuario' });
      }

      res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
    });
  } catch (error) {
    console.error('Error al encriptar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al procesar la contraseña' });
  }
};

// LISTAR USUARIOS ACTIVOS – SOLO ADMIN
const listarUsuarios = (req, res) => {
  const sql = `SELECT id, nombre, email, rol, estado 
               FROM usuarios 
               WHERE estado != 'INACTIVO' 
               ORDER BY id ASC`;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }

    res.json(resultados);
  });
};

// LISTAR USUARIOS INACTIVOS – SOLO ADMIN
const listarUsuariosInactivos = (req, res) => {
  const sql = `SELECT id, nombre, email, rol, estado 
               FROM usuarios 
               WHERE estado = 'INACTIVO' 
               ORDER BY id ASC`;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error('Error al obtener usuarios inactivos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener usuarios inactivos' });
    }

    res.json(resultados);
  });
};

// CAMBIAR CONTRASEÑA – Usuario autenticado
const cambiarContraseña = async (req, res) => {
  const { actual, nueva } = req.body;
  const usuarioId = req.usuario.id;

  if (!actual || !nueva) {
    return res.status(400).json({ mensaje: 'Debe ingresar la contraseña actual y la nueva' });
  }

  const sql = `SELECT contraseña FROM usuarios WHERE id = ?`;
  db.query(sql, [usuarioId], async (err, resultados) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ mensaje: 'Error al verificar la contraseña' });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const coincide = await bcrypt.compare(actual, resultados[0].contraseña);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    const nuevaHasheada = await bcrypt.hash(nueva, 10);
    const updateSql = `UPDATE usuarios SET contraseña = ? WHERE id = ?`;

    db.query(updateSql, [nuevaHasheada, usuarioId], (err2) => {
      if (err2) {
        console.error('Error al actualizar la contraseña:', err2);
        return res.status(500).json({ mensaje: 'No se pudo cambiar la contraseña' });
      }

      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
};

// EDITAR USUARIO – Solo ADMIN
const editarUsuario = (req, res) => {
  const id = req.params.id;
  const { nombre, email, rol } = req.body;

  if (!nombre || !email || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const rolesPermitidos = ['tecnico', 'bodeguero', 'administrador'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ mensaje: 'Rol no válido' });
  }

  const sql = `UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?`;

  db.query(sql, [nombre, email, rol, id], (err) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ mensaje: 'Error al editar usuario' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });
};

// ELIMINAR USUARIO – Lógico (estado INACTIVO)
const eliminarUsuario = (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE usuarios SET estado = 'INACTIVO' WHERE id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }

    res.json({ mensaje: 'Usuario marcado como inactivo correctamente' });
  });
};

// ACTIVAR USUARIO – estado = ACTIVO
const activarUsuario = (req, res) => {
  const id = req.params.id;

  const sql = `UPDATE usuarios SET estado = 'ACTIVO' WHERE id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error al activar usuario:', err);
      return res.status(500).json({ mensaje: 'Error al activar el usuario' });
    }

    res.json({ mensaje: 'Usuario activado correctamente' });
  });
};

module.exports = {
  registrarUsuario,
  listarUsuarios,
  listarUsuariosInactivos,
  cambiarContraseña,
  editarUsuario,
  eliminarUsuario,
  activarUsuario
};




