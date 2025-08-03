import ApiService from './ApiService';

class EmpresaService {
  static async getAll() {
    return ApiService.get('/empresas');
  }

  static async getById(id) {
    return ApiService.get(`/empresas/${id}`);
  }

  static async getUsuarios(empresaId) {
    return ApiService.get(`/empresas/${empresaId}/usuarios`);
  }

  static async getLineas(empresaId) {
    return ApiService.get(`/empresas/${empresaId}/lineas`);
  }

  static async create(empresa) {
    return ApiService.post('/empresas', empresa);
  }

  static async update(id, empresa) {
    return ApiService.put(`/empresas/${id}`, empresa);
  }

  static async delete(id) {
    return ApiService.delete(`/empresas/${id}`);
  }
}

export default EmpresaService;
