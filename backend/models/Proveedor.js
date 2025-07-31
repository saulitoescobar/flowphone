const { pool } = require('../config/database');

class Proveedor {
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM proveedores ORDER BY created_at DESC'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM proveedores WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(proveedorData) {
    const { nombre, contacto, telefono } = proveedorData;
    const [result] = await pool.execute(
      'INSERT INTO proveedores (nombre, contacto, telefono) VALUES (?, ?, ?)',
      [nombre, contacto, telefono]
    );
    return result.insertId;
  }

  static async update(id, proveedorData) {
    const { nombre, contacto, telefono } = proveedorData;
    const [result] = await pool.execute(
      'UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ? WHERE id = ?',
      [nombre, contacto, telefono, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM proveedores WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Proveedor;
