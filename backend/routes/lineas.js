const express = require('express');
const LineaController = require('../controllers/LineaController');

const router = express.Router();

// GET /api/lineas - Obtener todas las líneas
router.get('/', LineaController.getAll);

// GET /api/lineas/proveedor/:proveedorId - Obtener líneas por proveedor
router.get('/proveedor/:proveedorId', LineaController.getByProveedor);

// GET /api/lineas/:id - Obtener línea por ID
router.get('/:id', LineaController.getById);

// POST /api/lineas - Crear nueva línea
router.post('/', LineaController.create);

// PUT /api/lineas/:id - Actualizar línea
router.put('/:id', LineaController.update);

// DELETE /api/lineas/:id - Eliminar línea
router.delete('/:id', LineaController.delete);

module.exports = router;
