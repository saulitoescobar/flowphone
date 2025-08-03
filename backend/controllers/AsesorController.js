const Asesor = require('../models/Asesor');

class AsesorController {
  static async getAll(req, res) {
    try {
      console.log('📋 Obteniendo todos los asesores...');
      const asesores = await Asesor.getAll();
      console.log(`✅ Se encontraron ${asesores.length} asesores`);
      res.json(asesores);
    } catch (error) {
      console.error('❌ Error al obtener asesores:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔍 Buscando asesor con ID: ${id}`);
      
      const asesor = await Asesor.getById(id);
      if (!asesor) {
        console.log(`❌ Asesor con ID ${id} no encontrado`);
        return res.status(404).json({ error: 'Asesor no encontrado' });
      }
      
      console.log(`✅ Asesor encontrado: ${asesor.nombre}`);
      res.json(asesor);
    } catch (error) {
      console.error('❌ Error al obtener asesor:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
    }
  }

  static async getByProveedor(req, res) {
    try {
      const { proveedorId } = req.params;
      console.log(`🔍 Buscando asesores del proveedor ID: ${proveedorId}`);
      
      const asesores = await Asesor.getByProveedor(proveedorId);
      console.log(`✅ Se encontraron ${asesores.length} asesores para el proveedor`);
      res.json(asesores);
    } catch (error) {
      console.error('❌ Error al obtener asesores del proveedor:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
    }
  }

  static async create(req, res) {
    try {
      console.log('➕ Creando nuevo asesor...');
      console.log('📝 Datos recibidos:', req.body);
      
      const { proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil } = req.body;
      
      // Validaciones básicas
      if (!proveedor_id || !nombre || !puesto) {
        return res.status(400).json({ 
          error: 'Los campos proveedor_id, nombre y puesto son obligatorios' 
        });
      }

      const nuevoAsesor = await Asesor.create({
        proveedor_id,
        nombre,
        puesto,
        correo,
        telefono_fijo,
        telefono_movil
      });

      console.log(`✅ Asesor creado exitosamente: ${nuevoAsesor.nombre}`);
      res.status(201).json(nuevoAsesor);
    } catch (error) {
      console.error('❌ Error al crear asesor:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      console.log(`✏️ Actualizando asesor ID: ${id}`);
      console.log('📝 Datos recibidos:', req.body);
      
      const { proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil } = req.body;
      
      // Validaciones básicas
      if (!proveedor_id || !nombre || !puesto) {
        return res.status(400).json({ 
          error: 'Los campos proveedor_id, nombre y puesto son obligatorios' 
        });
      }

      const asesorActualizado = await Asesor.update(id, {
        proveedor_id,
        nombre,
        puesto,
        correo,
        telefono_fijo,
        telefono_movil
      });

      console.log(`✅ Asesor actualizado exitosamente: ${asesorActualizado.nombre}`);
      res.json(asesorActualizado);
    } catch (error) {
      console.error('❌ Error al actualizar asesor:', error);
      if (error.message === 'Asesor no encontrado o ya fue eliminado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor', 
          details: error.message 
        });
      }
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ Eliminando asesor ID: ${id}`);
      
      const resultado = await Asesor.delete(id);
      console.log(`✅ Asesor eliminado exitosamente`);
      res.json(resultado);
    } catch (error) {
      console.error('❌ Error al eliminar asesor:', error);
      if (error.message === 'Asesor no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor', 
          details: error.message 
        });
      }
    }
  }

  static async getPuestos(req, res) {
    try {
      console.log('📋 Obteniendo lista de puestos...');
      const puestos = await Asesor.getPuestos();
      console.log(`✅ Se encontraron ${puestos.length} tipos de puesto`);
      res.json(puestos);
    } catch (error) {
      console.error('❌ Error al obtener puestos:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor', 
        details: error.message 
      });
    }
  }
}

module.exports = AsesorController;
