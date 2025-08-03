const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

class AsesorService {
  static async getAll() {
    const response = await fetch(`${API_BASE_URL}/asesores`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  static async getById(id) {
    const response = await fetch(`${API_BASE_URL}/asesores/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  static async getByProveedor(proveedorId) {
    const response = await fetch(`${API_BASE_URL}/asesores/proveedor/${proveedorId}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  static async create(asesorData) {
    const response = await fetch(`${API_BASE_URL}/asesores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asesorData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async update(id, asesorData) {
    const response = await fetch(`${API_BASE_URL}/asesores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asesorData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async delete(id) {
    const response = await fetch(`${API_BASE_URL}/asesores/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  static async getPuestos() {
    const response = await fetch(`${API_BASE_URL}/asesores/puestos`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }
}

export default AsesorService;
