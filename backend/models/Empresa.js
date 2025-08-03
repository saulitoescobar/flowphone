const { pool } = require('../config/database');

class Empresa {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT 
        e.*,
        COUNT(DISTINCT u.id) as total_usuarios,
        COUNT(DISTINCT l.id) as total_lineas
      FROM empresas e
      LEFT JOIN usuarios u ON e.id = u.empresa_id
      LEFT JOIN lineas l ON e.id = l.empresa_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM empresas WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getUsuarios(empresaId) {
    console.log(`🔍 Buscando usuarios de la empresa ID: ${empresaId}`);
    const [rows] = await pool.execute(`
      SELECT 
        u.*,
        COUNT(l.id) as total_lineas
      FROM usuarios u
      LEFT JOIN lineas l ON u.id = l.usuario_id
      WHERE u.empresa_id = ?
      GROUP BY u.id
      ORDER BY u.nombre
    `, [empresaId]);
    console.log(`✅ Se encontraron ${rows.length} usuarios para la empresa`);
    return rows;
  }

  static async getLineas(empresaId) {
    console.log(`🔍 Buscando líneas de la empresa ID: ${empresaId}`);
    const [rows] = await pool.execute(`
      SELECT 
        l.id,
        l.numero,
        l.estado,
        l.fecha_activacion,
        u.nombre as usuario_nombre,
        p.nombre as plan_nombre,
        p.precio as plan_precio,
        COALESCE(pr_linea.nombre, pr_plan.nombre, 'Sin proveedor') as proveedor_nombre
      FROM lineas l
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN proveedores pr_linea ON l.proveedor_id = pr_linea.id
      LEFT JOIN proveedores pr_plan ON p.proveedor_id = pr_plan.id
      WHERE l.empresa_id = ?
      ORDER BY l.numero
    `, [empresaId]);
    console.log(`✅ Se encontraron ${rows.length} líneas para la empresa`);
    return rows;
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
