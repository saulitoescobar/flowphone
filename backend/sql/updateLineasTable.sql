-- Script para actualizar la tabla de líneas con la nueva estructura
USE gestion_lineas;

-- Actualizar la tabla de líneas para usar empresa_id en lugar de proveedor_id
-- y agregar campos de estado y fecha de activación

-- Primero verificar si la columna empresa_id ya existe
SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'gestion_lineas'
    AND TABLE_NAME = 'lineas'
    AND COLUMN_NAME = 'empresa_id'
);

-- Agregar empresa_id si no existe
SET @sql_add_empresa = IF(@column_exists = 0,
  'ALTER TABLE lineas ADD COLUMN empresa_id INT AFTER usuario_id, ADD FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL',
  'SELECT "La columna empresa_id ya existe" AS mensaje'
);

PREPARE stmt FROM @sql_add_empresa;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si la columna estado ya existe
SET @estado_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'gestion_lineas'
    AND TABLE_NAME = 'lineas'
    AND COLUMN_NAME = 'estado'
);

-- Agregar estado si no existe
SET @sql_add_estado = IF(@estado_exists = 0,
  "ALTER TABLE lineas ADD COLUMN estado ENUM('activa', 'suspendida', 'cancelada') DEFAULT 'activa' AFTER plan_id",
  'SELECT "La columna estado ya existe" AS mensaje'
);

PREPARE stmt FROM @sql_add_estado;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si la columna fecha_activacion ya existe
SET @fecha_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'gestion_lineas'
    AND TABLE_NAME = 'lineas'
    AND COLUMN_NAME = 'fecha_activacion'
);

-- Agregar fecha_activacion si no existe
SET @sql_add_fecha = IF(@fecha_exists = 0,
  'ALTER TABLE lineas ADD COLUMN fecha_activacion DATE AFTER estado',
  'SELECT "La columna fecha_activacion ya existe" AS mensaje'
);

PREPARE stmt FROM @sql_add_fecha;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si la columna activa todavía existe y eliminarla si es necesario
SET @activa_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'gestion_lineas'
    AND TABLE_NAME = 'lineas'
    AND COLUMN_NAME = 'activa'
);

-- Migrar datos de activa a estado si ambas columnas existen
SET @sql_migrate = IF(@activa_exists = 1 AND @estado_exists = 1,
  "UPDATE lineas SET estado = CASE WHEN activa = 1 THEN 'activa' ELSE 'suspendida' END WHERE estado = 'activa'",
  'SELECT "No hay datos que migrar" AS mensaje'
);

PREPARE stmt FROM @sql_migrate;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar la columna activa si existe
SET @sql_drop_activa = IF(@activa_exists = 1,
  'ALTER TABLE lineas DROP COLUMN activa',
  'SELECT "La columna activa no existe" AS mensaje'
);

PREPARE stmt FROM @sql_drop_activa;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si la columna proveedor_id todavía existe y eliminarla si es necesario
SET @proveedor_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'gestion_lineas'
    AND TABLE_NAME = 'lineas'
    AND COLUMN_NAME = 'proveedor_id'
);

-- Eliminar la columna proveedor_id si existe
SET @sql_drop_proveedor = IF(@proveedor_exists = 1,
  'ALTER TABLE lineas DROP FOREIGN KEY lineas_ibfk_3, DROP COLUMN proveedor_id',
  'SELECT "La columna proveedor_id no existe" AS mensaje'
);

PREPARE stmt FROM @sql_drop_proveedor;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Mostrar la estructura final de la tabla
DESCRIBE lineas;
