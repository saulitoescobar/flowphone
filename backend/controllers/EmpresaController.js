const Empresa = require('../models/Empresa');

class EmpresaController {
  static async getAll(req, res) {
    try {
      const empresas = await Empresa.getAll();
      res.json(empresas);
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const empresa = await Empresa.getById(id);
      
      if (!empresa) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }
      
      res.json(empresa);
    } catch (error) {
      console.error('Error al obtener empresa:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const empresaId = await Empresa.create(req.body);
      const nuevaEmpresa = await Empresa.getById(empresaId);
      res.status(201).json(nuevaEmpresa);
    } catch (error) {
      console.error('Error al crear empresa:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await Empresa.update(id, req.body);
      
      if (!actualizado) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }
      
      const empresaActualizada = await Empresa.getById(id);
      res.json(empresaActualizada);
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await Empresa.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Empresa no encontrada' });
      }
      
      res.json({ message: 'Empresa eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = EmpresaController;
