const { pool } = require('../config/database');

class Linea {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT l.*, 
             u.nombre as usuario_nombre, 
             e.nombre as empresa_nombre,
             p.nombre as plan_nombre,
             COALESCE(pr_linea.nombre, pr_plan.nombre) as proveedor_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN proveedores pr_linea ON l.proveedor_id = pr_linea.id
      LEFT JOIN proveedores pr_plan ON p.proveedor_id = pr_plan.id
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
             COALESCE(pr_linea.nombre, pr_plan.nombre) as proveedor_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN proveedores pr_linea ON l.proveedor_id = pr_linea.id
      LEFT JOIN proveedores pr_plan ON p.proveedor_id = pr_plan.id
      WHERE l.proveedor_id = ? OR p.proveedor_id = ?
      ORDER BY l.created_at DESC
    `, [proveedorId, proveedorId]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(`
      SELECT l.*, 
             u.nombre as usuario_nombre, 
             e.nombre as empresa_nombre,
             p.nombre as plan_nombre,
             COALESCE(pr_linea.nombre, pr_plan.nombre) as proveedor_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN proveedores pr_linea ON l.proveedor_id = pr_linea.id
      LEFT JOIN proveedores pr_plan ON p.proveedor_id = pr_plan.id
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(lineaData) {
    const { numero, usuario_id, empresa_id, plan_id, proveedor_id, estado, fecha_activacion } = lineaData;
    
    // Convertir fecha de ISO string a formato MySQL (YYYY-MM-DD)
    let fechaMysql = null;
    if (fecha_activacion) {
      const fecha = new Date(fecha_activacion);
      fechaMysql = fecha.toISOString().split('T')[0]; // Solo la parte YYYY-MM-DD
    }
    
    const [result] = await pool.execute(
      'INSERT INTO lineas (numero, usuario_id, empresa_id, plan_id, proveedor_id, estado, fecha_activacion) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [numero, usuario_id || null, empresa_id || null, plan_id || null, proveedor_id || null, estado || 'activa', fechaMysql]
    );
    return result.insertId;
  }

  static async update(id, lineaData) {
    const { numero, usuario_id, empresa_id, plan_id, proveedor_id, estado, fecha_activacion } = lineaData;
    console.log(`🔄 Ejecutando UPDATE para línea ID: ${id}`);
    console.log('📋 Datos extraídos:', { numero, usuario_id, empresa_id, plan_id, proveedor_id, estado, fecha_activacion });
    
    // Convertir fecha de ISO string a formato MySQL (YYYY-MM-DD)
    let fechaMysql = null;
    if (fecha_activacion) {
      const fecha = new Date(fecha_activacion);
      fechaMysql = fecha.toISOString().split('T')[0]; // Solo la parte YYYY-MM-DD
      console.log(`📅 Fecha convertida: ${fecha_activacion} → ${fechaMysql}`);
    }
    
    try {
      const [result] = await pool.execute(
        'UPDATE lineas SET numero = ?, usuario_id = ?, empresa_id = ?, plan_id = ?, proveedor_id = ?, estado = ?, fecha_activacion = ? WHERE id = ?',
        [numero, usuario_id || null, empresa_id || null, plan_id || null, proveedor_id || null, estado, fechaMysql, id]
      );
      console.log(`✅ UPDATE ejecutado. Filas afectadas: ${result.affectedRows}`);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Error en UPDATE SQL:', error);
      throw error;
    }
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
