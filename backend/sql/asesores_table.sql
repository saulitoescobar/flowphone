-- Crear tabla de asesores
CREATE TABLE IF NOT EXISTS asesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    puesto ENUM('ventas', 'post_ventas', 'soporte', 'gerencia', 'otro') NOT NULL DEFAULT 'ventas',
    correo VARCHAR(100),
    telefono_fijo VARCHAR(20),
    telefono_movil VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    INDEX idx_proveedor_id (proveedor_id),
    INDEX idx_puesto (puesto),
    INDEX idx_activo (activo)
);
