const express = require("express");
const router = express.Router();
const turismo_controller = require("../controller/turismo_controller");
const { body, param, validationResult } = require('express-validator');

// Middleware de validación
const manejarValidaciones = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const error = new Error('Error de validación');
        error.status = 400;
        error.details = errores.array();
        return next(error);
    }
    next();
};

// Validación para crear nuevo lugar
const validarNuevoLugar = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('pais').notEmpty().withMessage('El país es obligatorio'),
    body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
    body('tipo').notEmpty().withMessage('El tipo es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('El rating debe ser un número entre 0.0 y 5.0'),
    manejarValidaciones
];

// Validación para actualizar un lugar
const validarUpdateLugarPatch = [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('pais').optional().notEmpty().withMessage('El país no puede estar vacío'),
    body('ciudad').optional().isString(),
    body('tipo').optional().isString(),
    body('descripcion').optional().isString(),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('El rating debe ser un número entre 0.0 y 5.0'),
    manejarValidaciones
];

// Validación para id
const validarId = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    manejarValidaciones
];

/**
 * @swagger
 * tags:
 *   name: Lugares
 *   description: Rutas para gestionar lugares turísticos
 */

/**
 * @swagger
 * /turismo/lugares:
 *   get:
 *     summary: Obtener todos los lugares turísticos o un lugar específico por ID
 *     tags: [Lugares]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID del lugar a recuperar (opcional)
 *     responses:
 *       200:
 *         description: Lista de lugares turísticos o lugar turístico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: "Playa del Carmen"
 *                       pais:
 *                         type: string
 *                         example: "México"
 *                       ciudad:
 *                         type: string
 *                         example: "Playa del Carmen"
 *                       tipo:
 *                         type: string
 *                         example: "Playa"
 *                       descripcion:
 *                         type: string
 *                         example: "Una hermosa playa en la Riviera Maya."
 *                       rating:
 *                         type: number
 *                         format: float
 *                         example: 4.5
 *                 - type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nombre:
 *                       type: string
 *                       example: "Playa del Carmen"
 *                     pais:
 *                       type: string
 *                       example: "México"
 *                     ciudad:
 *                       type: string
 *                       example: "Playa del Carmen"
 *                     tipo:
 *                       type: string
 *                       example: "Playa"
 *                     descripcion:
 *                       type: string
 *                       example: "Una hermosa playa en la Riviera Maya."
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *       404:
 *         description: Lugar no encontrado
 */

/**
 * @swagger
 * /turismo/lugares:
 *   post:
 *     summary: Agregar un nuevo lugar turístico
 *     tags: [Lugares]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - pais
 *               - ciudad
 *               - tipo
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Chichén Itzá"
 *               pais:
 *                 type: string
 *                 example: "México"
 *               ciudad:
 *                 type: string
 *                 example: "Yucatán"
 *               tipo:
 *                 type: string
 *                 example: "Sitio arqueológico"
 *               descripcion:
 *                 type: string
 *                 example: "Una de las nuevas siete maravillas del mundo."
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.8
 *     responses:
 *       201:
 *         description: Lugar agregado correctamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /turismo/lugares/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un lugar turístico por ID
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del lugar a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Chichén Itzá"
 *               pais:
 *                 type: string
 *                 example: "México"
 *               ciudad:
 *                 type: string
 *                 example: "Yucatán"
 *               tipo:
 *                 type: string
 *                 example: "Sitio arqueológico"
 *               descripcion:
 *                 type: string
 *                 example: "Una de las nuevas siete maravillas del mundo."
 *               rating:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.8
 *     responses:
 *       200:
 *         description: Lugar actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Lugar actualizado correctamente"
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Lugar no encontrado
 */

/**
 * @swagger
 * /turismo/lugares/{id}:
 *   delete:
 *     summary: Eliminar un lugar turístico por ID
 *     tags: [Lugares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del lugar a eliminar
 *     responses:
 *       200:
 *         description: Lugar eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Lugar eliminado correctamente"
 *       404:
 *         description: Lugar no encontrado
 */

// Consultar todos o uno por ID (usando query)
router.get("/lugares", turismo_controller.consultarLugares);

// Agregar un nuevo lugar
router.post("/lugares", validarNuevoLugar, turismo_controller.agregarLugar);

// Actualizar un lugar por ID - Usamos PATCH para actualizar parcialmente
router.patch("/lugares/:id", validarId, validarUpdateLugarPatch, turismo_controller.actualizarLugar);

// Eliminar un lugar por ID
router.delete("/lugares/:id", validarId, turismo_controller.eliminarLugar);

module.exports = router;