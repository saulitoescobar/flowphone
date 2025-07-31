import ApiService from './ApiService';

class PlanService {
  static async getAll() {
    return ApiService.get('/planes');
  }

  static async getById(id) {
    return ApiService.get(`/planes/${id}`);
  }

  static async create(plan) {
    return ApiService.post('/planes', plan);
  }

  static async update(id, plan) {
    return ApiService.put(`/planes/${id}`, plan);
  }

  static async delete(id) {
    return ApiService.delete(`/planes/${id}`);
  }
}

export default PlanService;
