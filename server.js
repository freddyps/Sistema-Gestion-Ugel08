const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API RESTful institucional
const apiRoutes = require('./backend/routes/api');
app.use('/api', apiRoutes);

// Servir archivos estáticos del Frontend
app.use(express.static(BASE_DIR));

// Middleware para URLs amigables (ej: /dashboard -> /dashboard.html) y 404
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  let reqPath = req.path;
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(BASE_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }

  // Si no tiene extensión, intentar con .html
  if (!path.extname(reqPath)) {
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }

  // Página 404 personalizada con diseño UGEL
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>404 - UGEL 08 Cañete</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body style="display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f1f5f9; font-family:sans-serif;">
      <div style="text-align:center; background:white; padding:40px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.05); max-width:480px;">
        <h1 style="color:#0f172a; margin:0 0 8px;">404</h1>
        <h3 style="color:#334155; margin:0 0 16px;">Página no encontrada</h3>
        <p style="color:#64748b; font-size:14px; margin-bottom:24px;">La ruta solicitada no existe en el sistema de gestión y localización de resoluciones.</p>
        <a href="/dashboard.html" style="background:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:14px;">Volver al Dashboard</a>
      </div>
    </body>
    </html>
  `);
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error("Error en servidor:", err);
  res.status(500).json({ success: false, message: "Error interno del servidor", error: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SISTEMA UGEL 08 CAÑETE - ARQUITECTURA MODULAR ACTIVA `);
  console.log(`  Servidor HTTP + API REST corriendo en: http://localhost:${PORT}`);
  console.log(`  API Resoluciones: http://localhost:${PORT}/api/resoluciones`);
  console.log(`=======================================================`);
});
