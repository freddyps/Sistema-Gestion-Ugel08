-- ==========================================================================
-- BASE DE DATOS LOCAL PARA MICROSOFT SQL SERVER: ugel_resoluciones_test
-- Compatible con SQL Server Management Studio (SSMS)
-- ==========================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ugel_resoluciones_test')
BEGIN
    CREATE DATABASE [ugel_resoluciones_test];
END
GO

USE [ugel_resoluciones_test];
GO

-- Eliminar tablas en orden por claves foráneas si ya existían
IF OBJECT_ID('dbo.historial_resoluciones', 'U') IS NOT NULL DROP TABLE dbo.historial_resoluciones;
IF OBJECT_ID('dbo.notificaciones', 'U') IS NOT NULL DROP TABLE dbo.notificaciones;
IF OBJECT_ID('dbo.documentos', 'U') IS NOT NULL DROP TABLE dbo.documentos;
IF OBJECT_ID('dbo.resoluciones', 'U') IS NOT NULL DROP TABLE dbo.resoluciones;
IF OBJECT_ID('dbo.ubicaciones', 'U') IS NOT NULL DROP TABLE dbo.ubicaciones;
IF OBJECT_ID('dbo.personas', 'U') IS NOT NULL DROP TABLE dbo.personas;
GO

-- 1. Tabla personas / administrados
CREATE TABLE dbo.personas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    dni VARCHAR(15) NULL,
    nombres_completos NVARCHAR(255) NOT NULL,
    tipo_persona NVARCHAR(50) DEFAULT 'Docente',
    telefono VARCHAR(20) NULL,
    correo VARCHAR(150) NULL,
    estado VARCHAR(20) DEFAULT 'Activo',
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 2. Tabla ubicaciones físicas (Propuesta para localización en archivo)
CREATE TABLE dbo.ubicaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    sede NVARCHAR(100) NOT NULL DEFAULT 'Sede Principal',
    ambiente NVARCHAR(100) NOT NULL DEFAULT 'Archivo Central',
    estante NVARCHAR(50) NOT NULL DEFAULT 'Estante A',
    archivador NVARCHAR(50) NULL,
    caja NVARCHAR(50) NOT NULL,
    rango NVARCHAR(100) NULL,
    estado_archivo NVARCHAR(50) DEFAULT 'Archivado',
    observacion NVARCHAR(MAX) NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 3. Tabla resoluciones directorales (Entidad principal)
CREATE TABLE dbo.resoluciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    numero_rd NVARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    fecha_emision DATE NULL,
    numero_proyecto NVARCHAR(50) NULL,
    expediente NVARCHAR(50) NULL,
    administrado_id INT NULL,
    asunto NVARCHAR(MAX) NOT NULL,
    area_origen NVARCHAR(100) DEFAULT 'Recursos Humanos',
    estado NVARCHAR(50) DEFAULT 'Archivado',
    fecha_notificacion DATE NULL,
    ubicacion_id INT NULL,
    observaciones_origen NVARCHAR(MAX) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_rd_persona FOREIGN KEY (administrado_id) REFERENCES dbo.personas(id) ON DELETE SET NULL,
    CONSTRAINT fk_rd_ubicacion FOREIGN KEY (ubicacion_id) REFERENCES dbo.ubicaciones(id) ON DELETE SET NULL
);
GO

CREATE INDEX idx_rd_numero ON dbo.resoluciones (numero_rd);
CREATE INDEX idx_rd_anio ON dbo.resoluciones (anio);
GO

-- 4. Tabla documentos digitales (PDF)
CREATE TABLE dbo.documentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    resolucion_id INT NOT NULL,
    nombre_archivo NVARCHAR(255) NOT NULL,
    tipo_documento NVARCHAR(50) DEFAULT 'Resolución Directoral',
    ruta_archivo NVARCHAR(255) NOT NULL,
    numero_paginas INT DEFAULT 1,
    tamanio VARCHAR(20) DEFAULT '1.0 MB',
    estado VARCHAR(20) DEFAULT 'Disponible',
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_doc_resolucion FOREIGN KEY (resolucion_id) REFERENCES dbo.resoluciones(id) ON DELETE CASCADE
);
GO

-- 5. Tabla notificaciones
CREATE TABLE dbo.notificaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    resolucion_id INT NOT NULL,
    destinatario NVARCHAR(255) NOT NULL,
    medio NVARCHAR(100) DEFAULT 'Correo electrónico',
    fecha_notificacion DATE NULL,
    estado NVARCHAR(50) DEFAULT 'Notificado',
    detalle_cargo NVARCHAR(MAX) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_notif_resolucion FOREIGN KEY (resolucion_id) REFERENCES dbo.resoluciones(id) ON DELETE CASCADE
);
GO

-- 6. Tabla historial_resoluciones (Trazabilidad cronológica)
CREATE TABLE dbo.historial_resoluciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    resolucion_id INT NOT NULL,
    accion NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,
    usuario NVARCHAR(100) DEFAULT 'Marcos (Archivo)',
    fecha DATETIME NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_hist_resolucion FOREIGN KEY (resolucion_id) REFERENCES dbo.resoluciones(id) ON DELETE CASCADE
);
GO
