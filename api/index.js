const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;
require('dotenv').config();


// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
  origin: '*', // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

// Crear conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_URL || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'invitaciones',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.query(`
  CREATE TABLE IF NOT EXISTS invitados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    confirmado BOOLEAN NOT NULL DEFAULT FALSE,
    mensaje_personalizado TEXT,
    hashed_id VARCHAR(255) UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Error creando la tabla:', err);
  } else {
    console.log('Tabla "invitados" lista.');
  }
});

// Crear (POST)
app.post('/create', async (req, res) => {
  try {
    const { nombre, confirmado = false, mensaje_personalizado = null } = req.body;

    // Esperar el hash del nombre
    const hashed_id = await bcrypt.hash(nombre, 10);

    const query = `
      INSERT INTO invitados (nombre, confirmado, mensaje_personalizado, hashed_id)
      VALUES (?, ?, ?, ?)
    `;
    
    // Ejecutar la consulta con el hash ya disponible
    pool.query(query, [nombre, confirmado, mensaje_personalizado, hashed_id], (err, result) => {
      if (err) {
        console.error('Error insertando invitado:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.status(201).json({
        id: result.insertId,
        nombre,
        confirmado,
        mensaje_personalizado,
        hashed_id,
      });
    });
  } catch (error) {
    console.error('Error en la petición:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// Leer todos (GET)
app.get('/invitados', (req, res) => {  
  const query = 'SELECT * FROM invitados';
  pool.query(query, (err, results) => {
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

  pool.query(query, [id], (err, results) => {
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

  pool.query(query, [confirmado, id], (err, result) => {
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
app.delete('/delete', async (req, res) => {
  const invitados = req.body;  // El cuerpo de la solicitud debe ser un array de objetos con los campos 'id' y 'confirmado'
  const ids = invitados.map(invitado => parseInt(invitado.id));
  
  // Verificamos si hay IDs para eliminar
  if (ids.length === 0) {
    return res.status(400).json({ message: "No se seleccionaron invitados para eliminar." });
  }
  const query = 'DELETE FROM invitados WHERE id IN (?)';

  // Suponiendo que usas un pool o conexión a la base de datos
  pool.query(query, [ids], (err, result) => { // Usando el estilo de callback tradicional
    if (err) {
      console.error("Error al eliminar invitados:", err);
      return res.status(500).json({ message: "Hubo un error al eliminar los invitados." });
    }
    res.status(200).json({ message: "Invitados eliminados correctamente." });
  });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
