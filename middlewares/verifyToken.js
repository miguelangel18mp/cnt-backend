const jwt = require('jsonwebtoken');

const verifyToken = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;

      // Si se especifican roles permitidos, validamos
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' });
      }

      next(); // Todo OK
    } catch (error) {
      console.error('Error al verificar token:', error);
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
  };
};

module.exports = verifyToken;
