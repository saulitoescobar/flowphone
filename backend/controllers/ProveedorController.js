const Proveedor = require('../models/Proveedor');

class ProveedorController {
  static async getAll(req, res) {
    try {
      const proveedores = await Proveedor.getAll();
      res.json(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const proveedor = await Proveedor.getById(id);
      
      if (!proveedor) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      
      res.json(proveedor);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const proveedorId = await Proveedor.create(req.body);
      const nuevoProveedor = await Proveedor.getById(proveedorId);
      res.status(201).json(nuevoProveedor);
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await Proveedor.update(id, req.body);
      
      if (!actualizado) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      
      const proveedorActualizado = await Proveedor.getById(id);
      res.json(proveedorActualizado);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await Proveedor.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Proveedor no encontrado' });
      }
      
      res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = ProveedorController;
