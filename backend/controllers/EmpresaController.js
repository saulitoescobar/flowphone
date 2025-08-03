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

  static async getUsuarios(req, res) {
    try {
      const { empresaId } = req.params;
      console.log(`🔍 Buscando usuarios de la empresa ID: ${empresaId}`);
      
      const usuarios = await Empresa.getUsuarios(empresaId);
      console.log(`✅ Se encontraron ${usuarios.length} usuarios para la empresa`);
      res.json(usuarios);
    } catch (error) {
      console.error('❌ Error al obtener usuarios de la empresa:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
    }
  }

  static async getLineas(req, res) {
    try {
      const { empresaId } = req.params;
      console.log(`🔍 Buscando líneas de la empresa ID: ${empresaId}`);
      
      const lineas = await Empresa.getLineas(empresaId);
      console.log(`✅ Se encontraron ${lineas.length} líneas para la empresa`);
      res.json(lineas);
    } catch (error) {
      console.error('❌ Error al obtener líneas de la empresa:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
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
