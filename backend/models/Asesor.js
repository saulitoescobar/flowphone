const { pool } = require('../config/database');

class Asesor {
  static async getAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          a.*,
          p.nombre as proveedor_nombre
        FROM asesores a
        LEFT JOIN proveedores p ON a.proveedor_id = p.id
        WHERE a.activo = TRUE
        ORDER BY a.created_at DESC, a.id DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error en Asesor.getAll:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          a.*,
          p.nombre as proveedor_nombre
        FROM asesores a
        LEFT JOIN proveedores p ON a.proveedor_id = p.id
        WHERE a.id = ? AND a.activo = TRUE
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error en Asesor.getById:', error);
      throw error;
    }
  }

  static async getByProveedor(proveedorId) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          a.*,
          p.nombre as proveedor_nombre
        FROM asesores a
        LEFT JOIN proveedores p ON a.proveedor_id = p.id
        WHERE a.proveedor_id = ? AND a.activo = TRUE
        ORDER BY a.created_at DESC, a.id DESC
      `, [proveedorId]);
      return rows;
    } catch (error) {
      console.error('Error en Asesor.getByProveedor:', error);
      throw error;
    }
  }

  static async create(asesorData) {
    try {
      const { proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil } = asesorData;
      
      const [result] = await pool.execute(`
        INSERT INTO asesores (proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil]);
      
      return await this.getById(result.insertId);
    } catch (error) {
      console.error('Error en Asesor.create:', error);
      throw error;
    }
  }

  static async update(id, asesorData) {
    try {
      const { proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil } = asesorData;
      
      const [result] = await pool.execute(`
        UPDATE asesores 
        SET proveedor_id = ?, nombre = ?, puesto = ?, correo = ?, telefono_fijo = ?, telefono_movil = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND activo = TRUE
      `, [proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Asesor no encontrado o ya fue eliminado');
      }
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error en Asesor.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Soft delete - marcamos como inactivo en lugar de eliminar
      const [result] = await pool.execute(`
        UPDATE asesores 
        SET activo = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Asesor no encontrado');
      }
      
      return { message: 'Asesor eliminado correctamente' };
    } catch (error) {
      console.error('Error en Asesor.delete:', error);
      throw error;
    }
  }

  static async getPuestos() {
    return [
      { value: 'ventas', label: 'Ventas' },
      { value: 'post_ventas', label: 'Post-Ventas' },
      { value: 'soporte', label: 'Soporte Técnico' },
      { value: 'gerencia', label: 'Gerencia' },
      { value: 'otro', label: 'Otro' }
    ];
  }
}

module.exports = Asesor;
