const { pool } = require('../config/database');

class Usuario {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT id, nombre, email, telefono, empresa, created_at, updated_at
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
    const { nombre, email, telefono, empresa } = userData;
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, email, telefono, empresa) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, empresa]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { nombre, email, telefono, empresa } = userData;
    const [result] = await pool.execute(
      'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, empresa = ? WHERE id = ?',
      [nombre, email, telefono, empresa, id]
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
