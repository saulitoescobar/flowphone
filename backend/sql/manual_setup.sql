-- Script SQL para crear la base de datos y tablas en phpMyAdmin
-- Copia y pega este código en phpMyAdmin

-- 1. Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS phoneflow_db;
USE phoneflow_db;

-- 2. Crear tablas
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  empresa VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE proveedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  contacto VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE empresas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE planes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  datos VARCHAR(50),
  llamadas VARCHAR(50),
  precio DECIMAL(10,2),
  proveedor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

CREATE TABLE lineas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(20) UNIQUE NOT NULL,
  usuario_id INT,
  empresa_id INT,
  plan_id INT,
  estado ENUM('activa', 'suspendida', 'cancelada') DEFAULT 'activa',
  fecha_activacion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE SET NULL
);

-- 3. Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, telefono, empresa) VALUES
('Juan Pérez', 'juan@email.com', '555-0001', 'TechCorp'),
('María García', 'maria@email.com', '555-0002', 'InnovateSA'),
('Carlos López', 'carlos@email.com', '555-0003', 'TechCorp');

INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES
('Movistar', 'Ana Silva', '800-MOVISTAR', 'contacto@movistar.com'),
('Claro', 'Pedro Martín', '800-CLARO', 'info@claro.com'),
('Personal', 'Laura Fernández', '800-PERSONAL', 'contacto@personal.com');

INSERT INTO empresas (nombre, direccion, telefono, email) VALUES
('TechCorp', 'Av. Principal 123, CABA', '011-4444-5555', 'info@techcorp.com'),
('InnovateSA', 'Calle Secundaria 456, Córdoba', '0351-666-7777', 'contacto@innovatesa.com');

INSERT INTO planes (nombre, datos, llamadas, precio, proveedor_id) VALUES
('Plan Básico', '2GB', 'Ilimitadas', 1500.00, 1),
('Plan Medio', '5GB', 'Ilimitadas', 2500.00, 1),
('Plan Premium', '10GB', 'Ilimitadas', 3500.00, 2),
('Plan Empresarial', '20GB', 'Ilimitadas', 5000.00, 3);

INSERT INTO lineas (numero, usuario_id, empresa_id, plan_id, estado, fecha_activacion) VALUES
('555-0001', 1, 1, 1, 'activa', '2024-01-15'),
('555-0002', 2, 2, 2, 'activa', '2024-02-10'),
('555-0003', 3, 1, 3, 'suspendida', '2024-03-05');

-- ¡Listo! Tu base de datos está configurada
