const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', UsuarioController.getAll);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', UsuarioController.getById);

// POST /api/usuarios - Crear nuevo usuario
router.post('/', UsuarioController.create);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', UsuarioController.update);

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', UsuarioController.delete);

module.exports = router;
