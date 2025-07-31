const Linea = require('../models/Linea');

class LineaController {
  static async getAll(req, res) {
    try {
      const lineas = await Linea.getAll();
      res.json(lineas);
    } catch (error) {
      console.error('Error al obtener líneas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const linea = await Linea.getById(id);
      
      if (!linea) {
        return res.status(404).json({ error: 'Línea no encontrada' });
      }
      
      res.json(linea);
    } catch (error) {
      console.error('Error al obtener línea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const lineaId = await Linea.create(req.body);
      const nuevaLinea = await Linea.getById(lineaId);
      res.status(201).json(nuevaLinea);
    } catch (error) {
      console.error('Error al crear línea:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El número de línea ya existe' });
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await Linea.update(id, req.body);
      
      if (!actualizado) {
        return res.status(404).json({ error: 'Línea no encontrada' });
      }
      
      const lineaActualizada = await Linea.getById(id);
      res.json(lineaActualizada);
    } catch (error) {
      console.error('Error al actualizar línea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await Linea.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Línea no encontrada' });
      }
      
      res.json({ message: 'Línea eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar línea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = LineaController;
