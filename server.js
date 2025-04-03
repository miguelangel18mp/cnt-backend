const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Base de datos
const db = require('./config/db');

// Importar rutas
const cablesRoutes = require('./routes/cablesRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const logsRoutes = require('./routes/logsRoutes');
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes'); // 👈 NUEVO

// Usar rutas
app.use('/api/cables', cablesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes); // 👈 NUEVO

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API CNT Cable funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});




