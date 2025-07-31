const express = require('express');
const PlanController = require('../controllers/PlanController');

const router = express.Router();

// GET /api/planes - Obtener todos los planes
router.get('/', PlanController.getAll);

// GET /api/planes/:id - Obtener plan por ID
router.get('/:id', PlanController.getById);

// POST /api/planes - Crear nuevo plan
router.post('/', PlanController.create);

// PUT /api/planes/:id - Actualizar plan
router.put('/:id', PlanController.update);

// DELETE /api/planes/:id - Eliminar plan
router.delete('/:id', PlanController.delete);

module.exports = router;
