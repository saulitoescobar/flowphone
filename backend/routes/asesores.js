const express = require('express');
const router = express.Router();
const AsesorController = require('../controllers/AsesorController');

// Rutas para asesores
router.get('/', AsesorController.getAll);
router.get('/puestos', AsesorController.getPuestos);
router.get('/proveedor/:proveedorId', AsesorController.getByProveedor);
router.get('/:id', AsesorController.getById);
router.post('/', AsesorController.create);
router.put('/:id', AsesorController.update);
router.delete('/:id', AsesorController.delete);

module.exports = router;
