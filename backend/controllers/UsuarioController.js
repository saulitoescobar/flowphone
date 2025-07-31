const Usuario = require('../models/Usuario');

class UsuarioController {
  static async getAll(req, res) {
    try {
      const usuarios = await Usuario.getAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.getById(id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const usuarioId = await Usuario.create(req.body);
      const nuevoUsuario = await Usuario.getById(usuarioId);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El email ya existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await Usuario.update(id, req.body);
      
      if (!actualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const usuarioActualizado = await Usuario.getById(id);
      res.json(usuarioActualizado);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await Usuario.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = UsuarioController;
