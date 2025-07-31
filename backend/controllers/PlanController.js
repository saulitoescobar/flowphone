const Plan = require('../models/Plan');

class PlanController {
  static async getAll(req, res) {
    try {
      const planes = await Plan.getAll();
      res.json(planes);
    } catch (error) {
      console.error('Error al obtener planes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const plan = await Plan.getById(id);
      
      if (!plan) {
        return res.status(404).json({ error: 'Plan no encontrado' });
      }
      
      res.json(plan);
    } catch (error) {
      console.error('Error al obtener plan:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async create(req, res) {
    try {
      const planId = await Plan.create(req.body);
      const nuevoPlan = await Plan.getById(planId);
      res.status(201).json(nuevoPlan);
    } catch (error) {
      console.error('Error al crear plan:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await Plan.update(id, req.body);
      
      if (!actualizado) {
        return res.status(404).json({ error: 'Plan no encontrado' });
      }
      
      const planActualizado = await Plan.getById(id);
      res.json(planActualizado);
    } catch (error) {
      console.error('Error al actualizar plan:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await Plan.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Plan no encontrado' });
      }
      
      res.json({ message: 'Plan eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar plan:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = PlanController;
