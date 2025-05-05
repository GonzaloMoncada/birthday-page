const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
  origin: '*', // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

// Crear conexión a la base de datos
const connection = mysql.createConnection({
  host: '192.168.1.10',
  user: 'root',             // Tu usuario de MySQL
  password: 'hombre12',      // Tu contraseña
  database: 'invitaciones' // Poné el nombre correcto de tu base acá
});

// Conectar
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL!');

  // Crear la tabla si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS invitados (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      confirmado BOOLEAN NOT NULL DEFAULT FALSE,
      mensaje_personalizado TEXT
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creando la tabla:', err);
    } else {
      console.log('Tabla "invitados" lista.');
    }
  });
});

// Crear (POST)
app.post('/create', (req, res) => {
  const { nombre, confirmado = false, mensaje_personalizado = null } = req.body;
  const query = `
    INSERT INTO invitados (nombre, confirmado, mensaje_personalizado)
    VALUES (?, ?, ?)
  `;

  connection.query(query, [nombre, confirmado, mensaje_personalizado], (err, result) => {
    if (err) {
      console.error('Error insertando invitado:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.status(201).json({
      id: result.insertId,
      nombre,
      confirmado,
      mensaje_personalizado
    });
  });
});

// Leer todos (GET)
app.get('/invitados', (req, res) => {  
  const query = 'SELECT * FROM invitados';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error obteniendo invitados:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
      return;
    }
    res.json(results);
  });
});

// Leer uno por ID (GET)
app.get('/invitados/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM invitados WHERE hashed_id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error obteniendo invitado:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Invitado no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

// Confirmar invitado (PUT)
app.put('/invitados/:id/confirmar', (req, res) => {
  
  const id = parseInt(req.params.id);
  console.log('id', id);
  const { confirmado } = req.body;

  const query = 'UPDATE invitados SET confirmado = ? WHERE id = ?';

  connection.query(query, [confirmado, id], (err, result) => {
    if (err) {
      console.error('Error actualizando confirmado:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Invitado no encontrado' });
    } else {
      res.json({ id, confirmado });
    }
  });
});
// Borrar por ID (DELETE)
app.delete('/invitados/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const query = 'DELETE FROM invitados WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error borrando invitado:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Invitado no encontrado' });
    } else {
      res.json({ message: 'Invitado borrado exitosamente' });
    }
  });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
