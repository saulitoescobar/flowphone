import ApiService from './ApiService';

class LineaService {
  static async getAll() {
    return ApiService.get('/lineas');
  }

  static async getById(id) {
    return ApiService.get(`/lineas/${id}`);
  }

  static async create(linea) {
    return ApiService.post('/lineas', linea);
  }

  static async update(id, linea) {
    return ApiService.put(`/lineas/${id}`, linea);
  }

  static async delete(id) {
    return ApiService.delete(`/lineas/${id}`);
  }
}

export default LineaService;
