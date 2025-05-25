const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mysql = require('mysql2');

// Conexión a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports.conexion = conexion;

// Obtener todos los lugares o uno por ID
function consultarLugares(req, res, next) {
    let consulta = '';
    let valores = [];

    if (typeof req.query.id === 'undefined') {
        consulta = 'SELECT * FROM lugaresturisticos';
    } else {
        consulta = 'SELECT * FROM lugaresturisticos WHERE id = ?';
        valores = [req.query.id];
    }

    conexion.query(consulta, valores, (err, results) => {
        if (err) return next(err);

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: "Lugar no encontrado" });
        }
    });
}

module.exports.consultarLugares = consultarLugares;

// Eliminar un lugar turístico por ID
function eliminarLugar(req, res, next) {
    const { id } = req.params;

    const sql = 'DELETE FROM lugaresturisticos WHERE id = ?';

    conexion.query(sql, [id], (err, result) => {
        if (err) return next(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        res.json({ mensaje: "Lugar eliminado correctamente" });
    });
}

module.exports.eliminarLugar = eliminarLugar;

// Agregar un nuevo lugar turístico
function agregarLugar(req, res, next) {
    const { nombre, pais, ciudad, tipo, descripcion, rating } = req.body;

    if (!nombre || !pais) {
        return res.status(400).json({ error: "Los campos 'nombre' y 'pais' son obligatorios" });
    }

    const sql = 'INSERT INTO lugaresturisticos (nombre, pais, ciudad, tipo, descripcion, rating) VALUES (?, ?, ?, ?, ?, ?)';
    const valores = [nombre, pais, ciudad || null, tipo || null, descripcion || null, rating || null];

    conexion.query(sql, valores, (err, result) => {
        if (err) return next(err);

        res.status(201).json({ mensaje: "Lugar agregado correctamente", id: result.insertId });
    });
}

module.exports.agregarLugar = agregarLugar;

// Actualizar un lugar turístico
function actualizarLugar(req, res, next) {
    const { id } = req.params;
    const { nombre, pais, ciudad, tipo, descripcion, rating } = req.body;

    const sql = `
        UPDATE lugaresturisticos 
        SET 
            nombre = COALESCE(?, nombre),
            pais = COALESCE(?, pais),
            ciudad = COALESCE(?, ciudad),
            tipo = COALESCE(?, tipo),
            descripcion = COALESCE(?, descripcion),
            rating = COALESCE(?, rating)
        WHERE id = ?
    `;
    const valores = [nombre, pais, ciudad, tipo, descripcion, rating, id];

    conexion.query(sql, valores, (err, result) => {
        if (err) return next(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Lugar no encontrado" });
        }

        res.json({ mensaje: "Lugar actualizado correctamente" });
    });
}

module.exports.actualizarLugar = actualizarLugar;