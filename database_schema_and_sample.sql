-- ==========================================================================
-- BASE DE DATOS LOCAL DE PRUEBAS: ugel_resoluciones_test
-- Generado a partir del análisis del Excel real institucional
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS `ugel_resoluciones_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ugel_resoluciones_test`;

DROP TABLE IF EXISTS `historial_resoluciones`;
DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `documentos`;
DROP TABLE IF EXISTS `resoluciones`;
DROP TABLE IF EXISTS `ubicaciones`;
DROP TABLE IF EXISTS `personas`;

CREATE TABLE `personas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dni` VARCHAR(15) NULL,
  `nombres_completos` VARCHAR(255) NOT NULL,
  `tipo_persona` VARCHAR(50) DEFAULT 'Docente',
  `telefono` VARCHAR(20) NULL,
  `correo` VARCHAR(150) NULL,
  `estado` VARCHAR(20) DEFAULT 'Activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `ubicaciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sede` VARCHAR(100) NOT NULL DEFAULT 'Sede Principal',
  `ambiente` VARCHAR(100) NOT NULL DEFAULT 'Archivo Central',
  `estante` VARCHAR(50) NOT NULL DEFAULT 'Estante A',
  `archivador` VARCHAR(50) NULL,
  `caja` VARCHAR(50) NOT NULL,
  `rango` VARCHAR(100) NULL,
  `estado_archivo` VARCHAR(50) DEFAULT 'Archivado',
  `observacion` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `resoluciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `numero_rd` VARCHAR(50) NOT NULL,
  `anio` INT NOT NULL,
  `fecha_emision` DATE NULL,
  `numero_proyecto` VARCHAR(50) NULL,
  `expediente` VARCHAR(50) NULL,
  `administrado_id` INT NULL,
  `asunto` TEXT NOT NULL,
  `area_origen` VARCHAR(100) DEFAULT 'Recursos Humanos',
  `estado` VARCHAR(50) DEFAULT 'Archivado',
  `fecha_notificacion` DATE NULL,
  `ubicacion_id` INT NULL,
  `observaciones_origen` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_rd_numero` (`numero_rd`),
  INDEX `idx_rd_anio` (`anio`),
  CONSTRAINT `fk_rd_persona` FOREIGN KEY (`administrado_id`) REFERENCES `personas` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_rd_ubicacion` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `documentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `resolucion_id` INT NOT NULL,
  `nombre_archivo` VARCHAR(255) NOT NULL,
  `tipo_documento` VARCHAR(50) DEFAULT 'Resolución Directoral',
  `ruta_archivo` VARCHAR(255) NOT NULL,
  `numero_paginas` INT DEFAULT 1,
  `tamanio` VARCHAR(20) DEFAULT '1.0 MB',
  `estado` VARCHAR(20) DEFAULT 'Disponible',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_doc_resolucion` FOREIGN KEY (`resolucion_id`) REFERENCES `resoluciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notificaciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `resolucion_id` INT NOT NULL,
  `destinatario` VARCHAR(255) NOT NULL,
  `medio` VARCHAR(100) DEFAULT 'Correo electrónico',
  `fecha_notificacion` DATE NULL,
  `estado` VARCHAR(50) DEFAULT 'Notificado',
  `detalle_cargo` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_resolucion` FOREIGN KEY (`resolucion_id`) REFERENCES `resoluciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `historial_resoluciones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `resolucion_id` INT NOT NULL,
  `accion` VARCHAR(100) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `usuario` VARCHAR(100) DEFAULT 'Marcos (Archivo)',
  `fecha` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hist_resolucion` FOREIGN KEY (`resolucion_id`) REFERENCES `resoluciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
