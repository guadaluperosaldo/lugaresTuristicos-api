const path = require("path");
const express = require("express");
const winston = require("winston");
const app = express();
const turismo_router = require("./router/turismo_router");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

// Configuración del logger
const logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, "logs/errores.log") })
    ],
});

// Configuración de CORS
app.use(cors({
  origin: ['http://lugaresturisticos-api-production.up.railway.app/api-docs', '*'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const swaggerOptions = {
  definition: require('./swagger.json'),
  apis: [path.join(__dirname, './router/*.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/turismo", turismo_router);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    const err = new Error("Ruta no encontrada");
    next(err);
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });

    if (err.status === 400) {
        return res.status(400).json({
            error: err.message,
            detalles: err.details || []
        });
    }

    res.status(500).json({ error: err.message });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
