-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS phoneflow_db;
USE phoneflow_db;

-- Tabla de Empresas
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(500),
    contacto VARCHAR(255),
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
    datos VARCHAR(100),
    llamadas VARCHAR(100),
    precio VARCHAR(50),
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
    linea VARCHAR(50),
    plan VARCHAR(255),
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
    proveedor_id INT,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE SET NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- Insertar datos de ejemplo
INSERT INTO empresas (nombre, direccion, contacto) VALUES
('TechCorp Solutions', 'Av. Principal 123, Ciudad', 'contacto@techcorp.com'),
('Innovatech Solutions', 'Calle Comercial 456, Centro', 'info@innovatech.com'),
('Digital Dynamics', 'Plaza Central 789, Norte', 'admin@digitaldynamics.com');

INSERT INTO proveedores (nombre, contacto, telefono) VALUES
('TelcoCorp', 'ventas@telcocorp.com', '555-0001'),
('MovilNet', 'info@movilnet.com', '555-0002'),
('ConnectPlus', 'soporte@connectplus.com', '555-0003');

INSERT INTO planes (nombre, datos, llamadas, precio, proveedor_id) VALUES
('Básico', '10 GB', 'Limitadas', '$25', 1),
('Premium', '50 GB', 'Ilimitadas', '$45', 1),
('Empresarial', '100 GB', 'Ilimitadas', '$65', 2),
('Corporativo', 'Ilimitado', 'Ilimitadas', '$85', 3);

INSERT INTO usuarios (nombre, email, linea, plan, empresa_id) VALUES
('Juan Pérez', 'juan.perez@techcorp.com', '555-1001', 'Premium', 1),
('María García', 'maria.garcia@innovatech.com', '555-1002', 'Básico', 2),
('Carlos López', 'carlos.lopez@techcorp.com', '555-1003', 'Empresarial', 1),
('Ana Martínez', 'ana.martinez@digitaldynamics.com', '555-1004', 'Corporativo', 3);

INSERT INTO lineas (numero, usuario_id, plan_id, proveedor_id) VALUES
('555-1001', 1, 2, 1),
('555-1002', 2, 1, 1),
('555-1003', 3, 3, 2),
('555-1004', 4, 4, 3),
('555-1005', NULL, 1, 1);
