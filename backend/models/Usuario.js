const { pool } = require('../config/database');

class Usuario {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT id, nombre, email, dpi, telefono, empresa, created_at, updated_at
      FROM usuarios 
      ORDER BY created_at DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(userData) {
    const { nombre, email, dpi, telefono, empresa } = userData;
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, email, dpi, telefono, empresa) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, dpi, telefono, empresa]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { nombre, email, dpi, telefono, empresa } = userData;
    const [result] = await pool.execute(
      'UPDATE usuarios SET nombre = ?, email = ?, dpi = ?, telefono = ?, empresa = ? WHERE id = ?',
      [nombre, email, dpi, telefono, empresa, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Usuario;
