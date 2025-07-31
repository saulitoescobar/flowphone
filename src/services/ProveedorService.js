import ApiService from './ApiService';

class ProveedorService {
  static async getAll() {
    return ApiService.get('/proveedores');
  }

  static async getById(id) {
    return ApiService.get(`/proveedores/${id}`);
  }

  static async create(proveedor) {
    return ApiService.post('/proveedores', proveedor);
  }

  static async update(id, proveedor) {
    return ApiService.put(`/proveedores/${id}`, proveedor);
  }

  static async delete(id) {
    return ApiService.delete(`/proveedores/${id}`);
  }
}

export default ProveedorService;
