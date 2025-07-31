import ApiService from './ApiService';

class UsuarioService {
  static async getAll() {
    return ApiService.get('/usuarios');
  }

  static async getById(id) {
    return ApiService.get(`/usuarios/${id}`);
  }

  static async create(usuario) {
    return ApiService.post('/usuarios', usuario);
  }

  static async update(id, usuario) {
    return ApiService.put(`/usuarios/${id}`, usuario);
  }

  static async delete(id) {
    return ApiService.delete(`/usuarios/${id}`);
  }
}

export default UsuarioService;
