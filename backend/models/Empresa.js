const { pool } = require('../config/database');

class Empresa {
  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM empresas ORDER BY created_at DESC'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM empresas WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(empresaData) {
    const { nombre, direccion, contacto, nit } = empresaData;
    const [result] = await pool.execute(
      'INSERT INTO empresas (nombre, nit, direccion, contacto) VALUES (?, ?, ?, ?)',
      [nombre, nit, direccion, contacto]
    );
    return result.insertId;
  }

  static async update(id, empresaData) {
    const { nombre, direccion, contacto, nit } = empresaData;
    const [result] = await pool.execute(
      'UPDATE empresas SET nombre = ?, nit = ?, direccion = ?, contacto = ? WHERE id = ?',
      [nombre, nit, direccion, contacto, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM empresas WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Empresa;
