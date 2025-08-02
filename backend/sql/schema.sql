-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS flowphone_db;
USE flowphone_db;

-- Tabla de Empresas
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(500),
    telefono VARCHAR(50),
    nit VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Planes
CREATE TABLE IF NOT EXISTS planes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    datos VARCHAR(100),
    llamadas VARCHAR(100),
    precio DECIMAL(10,2),
    proveedor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    empresa_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
);

-- Tabla de Líneas
CREATE TABLE IF NOT EXISTS lineas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(50) NOT NULL UNIQUE,
    usuario_id INT,
    plan_id INT,
    empresa_id INT,
    estado ENUM('activa', 'inactiva', 'suspendida') DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE SET NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
);

-- Insertar datos de ejemplo
INSERT IGNORE INTO empresas (nombre, direccion, telefono, nit) VALUES
('TechCorp Solutions', 'Av. Principal 123, Ciudad', '555-0101', 'TC-001'),
('Innovatech Solutions', 'Calle Comercial 456, Centro', '555-0102', 'IT-002'),
('Digital Dynamics', 'Plaza Central 789, Norte', '555-0103', 'DD-003');

INSERT IGNORE INTO proveedores (nombre, contacto, telefono) VALUES
('TelcoCorp', 'ventas@telcocorp.com', '555-0001'),
('MovilNet', 'info@movilnet.com', '555-0002'),
('ConnectPlus', 'soporte@connectplus.com', '555-0003');

INSERT IGNORE INTO planes (nombre, descripcion, datos, llamadas, precio, proveedor_id) VALUES
('Básico', 'Plan básico para uso personal', '10 GB', 'Limitadas', 25.00, 1),
('Premium', 'Plan premium con más beneficios', '50 GB', 'Ilimitadas', 45.00, 1),
('Empresarial', 'Plan diseñado para empresas', '100 GB', 'Ilimitadas', 65.00, 2),
('Corporativo', 'Plan corporativo con servicios premium', 'Ilimitado', 'Ilimitadas', 85.00, 3);

INSERT IGNORE INTO usuarios (nombre, email, telefono, empresa_id) VALUES
('Juan Pérez', 'juan.perez@techcorp.com', '555-1001', 1),
('María García', 'maria.garcia@innovatech.com', '555-1002', 2),
('Carlos López', 'carlos.lopez@techcorp.com', '555-1003', 1),
('Ana Martínez', 'ana.martinez@digitaldynamics.com', '555-1004', 3);

INSERT IGNORE INTO lineas (numero, usuario_id, plan_id, empresa_id, estado) VALUES
('555-1001', 1, 2, 1, 'activa'),
('555-1002', 2, 1, 2, 'activa'),
('555-1003', 3, 3, 1, 'activa'),
('555-1004', 4, 4, 3, 'inactiva'),
('555-1005', NULL, 1, 1, 'activa');
