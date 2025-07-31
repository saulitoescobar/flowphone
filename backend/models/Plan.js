const { pool } = require('../config/database');

class Plan {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT p.*, pr.nombre as proveedor_nombre 
      FROM planes p 
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM planes WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(planData) {
    const { nombre, datos, llamadas, precio, proveedor_id } = planData;
    const [result] = await pool.execute(
      'INSERT INTO planes (nombre, datos, llamadas, precio, proveedor_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, datos, llamadas, precio, proveedor_id || null]
    );
    return result.insertId;
  }

  static async update(id, planData) {
    const { nombre, datos, llamadas, precio, proveedor_id } = planData;
    const [result] = await pool.execute(
      'UPDATE planes SET nombre = ?, datos = ?, llamadas = ?, precio = ?, proveedor_id = ? WHERE id = ?',
      [nombre, datos, llamadas, precio, proveedor_id || null, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM planes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Plan;
