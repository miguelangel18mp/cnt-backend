const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ✅ Middlewares con límite aumentado para imágenes (hasta 15MB)
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));

// Base de datos
const db = require('./config/db');

// Importar rutas
const cablesRoutes = require('./routes/cablesRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const logsRoutes = require('./routes/logsRoutes');
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const desmontajesRoutes = require('./routes/desmontajesRoutes'); // ✅ NUEVO

// Usar rutas
app.use('/api/cables', cablesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/desmontajes', desmontajesRoutes); // ✅ NUEVO

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API CNT Cable funcionando');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});






