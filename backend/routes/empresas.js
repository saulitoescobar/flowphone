const express = require('express');
const EmpresaController = require('../controllers/EmpresaController');

const router = express.Router();

// GET /api/empresas - Obtener todas las empresas
router.get('/', EmpresaController.getAll);

// GET /api/empresas/:id - Obtener empresa por ID
router.get('/:id', EmpresaController.getById);

// POST /api/empresas - Crear nueva empresa
router.post('/', EmpresaController.create);

// PUT /api/empresas/:id - Actualizar empresa
router.put('/:id', EmpresaController.update);

// DELETE /api/empresas/:id - Eliminar empresa
router.delete('/:id', EmpresaController.delete);

module.exports = router;
