const { pool } = require('../config/database');

class Linea {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT l.*, 
             u.nombre as usuario_nombre, 
             e.nombre as empresa_nombre,
             p.nombre as plan_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      LEFT JOIN planes p ON l.plan_id = p.id
      ORDER BY l.created_at DESC
    `);
    return rows;
  }

  static async getByProveedor(proveedorId) {
    const [rows] = await pool.execute(`
      SELECT l.*, 
             u.nombre as usuario_nombre, 
             e.nombre as empresa_nombre,
             p.nombre as plan_nombre,
             pr.nombre as proveedor_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      WHERE p.proveedor_id = ?
      ORDER BY l.created_at DESC
    `, [proveedorId]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(`
      SELECT l.*, 
             u.nombre as usuario_nombre, 
             e.nombre as empresa_nombre,
             p.nombre as plan_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      LEFT JOIN planes p ON l.plan_id = p.id
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(lineaData) {
    const { numero, usuario_id, empresa_id, plan_id, estado, fecha_activacion } = lineaData;
    const [result] = await pool.execute(
      'INSERT INTO lineas (numero, usuario_id, empresa_id, plan_id, estado, fecha_activacion) VALUES (?, ?, ?, ?, ?, ?)',
      [numero, usuario_id || null, empresa_id || null, plan_id || null, estado || 'activa', fecha_activacion || null]
    );
    return result.insertId;
  }

  static async update(id, lineaData) {
    const { numero, usuario_id, empresa_id, plan_id, estado, fecha_activacion } = lineaData;
    const [result] = await pool.execute(
      'UPDATE lineas SET numero = ?, usuario_id = ?, empresa_id = ?, plan_id = ?, estado = ?, fecha_activacion = ? WHERE id = ?',
      [numero, usuario_id || null, empresa_id || null, plan_id || null, estado, fecha_activacion || null, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM lineas WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Linea;
