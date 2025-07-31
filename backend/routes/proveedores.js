const express = require('express');
const ProveedorController = require('../controllers/ProveedorController');

const router = express.Router();

// GET /api/proveedores - Obtener todos los proveedores
router.get('/', ProveedorController.getAll);

// GET /api/proveedores/:id - Obtener proveedor por ID
router.get('/:id', ProveedorController.getById);

// POST /api/proveedores - Crear nuevo proveedor
router.post('/', ProveedorController.create);

// PUT /api/proveedores/:id - Actualizar proveedor
router.put('/:id', ProveedorController.update);

// DELETE /api/proveedores/:id - Eliminar proveedor
router.delete('/:id', ProveedorController.delete);

module.exports = router;
