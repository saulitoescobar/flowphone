// Funciones para trabajar con la base de datos MySQL

const getUsuarios = async (pool) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.*, e.nombre as empresa_nombre 
      FROM usuarios u 
      LEFT JOIN empresas e ON u.empresa_id = e.id
      ORDER BY u.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

const createUsuario = async (pool, usuario) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, email, telefono, empresa_id) VALUES (?, ?, ?, ?)',
      [usuario.nombre, usuario.email, usuario.telefono, usuario.empresa_id]
    );
    return { id: result.insertId, ...usuario };
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};

const updateUsuario = async (pool, id, usuario) => {
  try {
    await pool.execute(
      'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, empresa_id = ? WHERE id = ?',
      [usuario.nombre, usuario.email, usuario.telefono, usuario.empresa_id, id]
    );
    return { id, ...usuario };
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

const deleteUsuario = async (pool, id) => {
  try {
    await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    return { message: 'Usuario eliminado correctamente' };
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

const getEmpresas = async (pool) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM empresas ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    throw error;
  }
};

const createEmpresa = async (pool, empresa) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO empresas (nombre, direccion, telefono, nit) VALUES (?, ?, ?, ?)',
      [empresa.nombre, empresa.direccion, empresa.telefono, empresa.nit]
    );
    return { id: result.insertId, ...empresa };
  } catch (error) {
    console.error('Error creando empresa:', error);
    throw error;
  }
};

const updateEmpresa = async (pool, id, empresa) => {
  try {
    await pool.execute(
      'UPDATE empresas SET nombre = ?, direccion = ?, telefono = ?, nit = ? WHERE id = ?',
      [empresa.nombre, empresa.direccion, empresa.telefono, empresa.nit, id]
    );
    return { id, ...empresa };
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    throw error;
  }
};

const deleteEmpresa = async (pool, id) => {
  try {
    await pool.execute('DELETE FROM empresas WHERE id = ?', [id]);
    return { message: 'Empresa eliminada correctamente' };
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    throw error;
  }
};

const getPlanes = async (pool) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, pr.nombre as proveedor_nombre 
      FROM planes p 
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error obteniendo planes:', error);
    throw error;
  }
};

const createPlan = async (pool, plan) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO planes (nombre, descripcion, datos, llamadas, precio, proveedor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [plan.nombre, plan.descripcion, plan.datos, plan.llamadas, plan.precio, plan.proveedor_id]
    );
    return { id: result.insertId, ...plan };
  } catch (error) {
    console.error('Error creando plan:', error);
    throw error;
  }
};

const updatePlan = async (pool, id, plan) => {
  try {
    await pool.execute(
      'UPDATE planes SET nombre = ?, descripcion = ?, datos = ?, llamadas = ?, precio = ?, proveedor_id = ? WHERE id = ?',
      [plan.nombre, plan.descripcion, plan.datos, plan.llamadas, plan.precio, plan.proveedor_id, id]
    );
    return { id, ...plan };
  } catch (error) {
    console.error('Error actualizando plan:', error);
    throw error;
  }
};

const deletePlan = async (pool, id) => {
  try {
    await pool.execute('DELETE FROM planes WHERE id = ?', [id]);
    return { message: 'Plan eliminado correctamente' };
  } catch (error) {
    console.error('Error eliminando plan:', error);
    throw error;
  }
};

const getProveedores = async (pool) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM proveedores ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    throw error;
  }
};

const createProveedor = async (pool, proveedor) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO proveedores (nombre, contacto, telefono) VALUES (?, ?, ?)',
      [proveedor.nombre, proveedor.contacto, proveedor.telefono]
    );
    return { id: result.insertId, ...proveedor };
  } catch (error) {
    console.error('Error creando proveedor:', error);
    throw error;
  }
};

const updateProveedor = async (pool, id, proveedor) => {
  try {
    await pool.execute(
      'UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ? WHERE id = ?',
      [proveedor.nombre, proveedor.contacto, proveedor.telefono, id]
    );
    return { id, ...proveedor };
  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    throw error;
  }
};

const deleteProveedor = async (pool, id) => {
  try {
    await pool.execute('DELETE FROM proveedores WHERE id = ?', [id]);
    return { message: 'Proveedor eliminado correctamente' };
  } catch (error) {
    console.error('Error eliminando proveedor:', error);
    throw error;
  }
};

const getLineas = async (pool) => {
  try {
    const [rows] = await pool.execute(`
      SELECT l.*, u.nombre as usuario_nombre, p.nombre as plan_nombre, e.nombre as empresa_nombre
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      ORDER BY l.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('Error obteniendo líneas:', error);
    throw error;
  }
};

const createLinea = async (pool, linea) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO lineas (numero, usuario_id, plan_id, empresa_id, estado) VALUES (?, ?, ?, ?, ?)',
      [linea.numero, linea.usuario_id, linea.plan_id, linea.empresa_id, linea.estado || 'activa']
    );
    return { id: result.insertId, ...linea };
  } catch (error) {
    console.error('Error creando línea:', error);
    throw error;
  }
};

const updateLinea = async (pool, id, linea) => {
  try {
    await pool.execute(
      'UPDATE lineas SET numero = ?, usuario_id = ?, plan_id = ?, empresa_id = ?, estado = ? WHERE id = ?',
      [linea.numero, linea.usuario_id, linea.plan_id, linea.empresa_id, linea.estado, id]
    );
    return { id, ...linea };
  } catch (error) {
    console.error('Error actualizando línea:', error);
    throw error;
  }
};

const deleteLinea = async (pool, id) => {
  try {
    await pool.execute('DELETE FROM lineas WHERE id = ?', [id]);
    return { message: 'Línea eliminada correctamente' };
  } catch (error) {
    console.error('Error eliminando línea:', error);
    throw error;
  }
};

// Estadísticas para el dashboard
const getDashboardStats = async (pool) => {
  try {
    const [usuariosCount] = await pool.execute('SELECT COUNT(*) as total FROM usuarios');
    const [empresasCount] = await pool.execute('SELECT COUNT(*) as total FROM empresas');
    const [lineasCount] = await pool.execute('SELECT COUNT(*) as total FROM lineas');
    const [planesCount] = await pool.execute('SELECT COUNT(*) as total FROM planes');
    const [proveedoresCount] = await pool.execute('SELECT COUNT(*) as total FROM proveedores');
    
    const [lineasActivas] = await pool.execute("SELECT COUNT(*) as total FROM lineas WHERE estado = 'activa'");
    const [lineasInactivas] = await pool.execute("SELECT COUNT(*) as total FROM lineas WHERE estado != 'activa'");
    
    // Líneas próximas a renovarse (próximos 30 días)
    const [lineasPorRenovar] = await pool.execute(`
      SELECT COUNT(*) as total FROM lineas 
      WHERE fecha_renovacion <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
      AND fecha_renovacion >= CURDATE()
      AND estado = 'activa'
    `);

    // Líneas vencidas (ya pasó la fecha de renovación)
    const [lineasVencidas] = await pool.execute(`
      SELECT COUNT(*) as total FROM lineas 
      WHERE fecha_renovacion < CURDATE()
      AND estado = 'activa'
    `);
    
    return {
      usuarios: usuariosCount[0].total,
      empresas: empresasCount[0].total,
      lineas: lineasCount[0].total,
      planes: planesCount[0].total,
      proveedores: proveedoresCount[0].total,
      lineasActivas: lineasActivas[0].total,
      lineasInactivas: lineasInactivas[0].total,
      lineasPorRenovar: lineasPorRenovar[0].total,
      lineasVencidas: lineasVencidas[0].total
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

// Obtener líneas próximas a renovarse
const getLineasProximasRenovacion = async (pool, dias = 30) => {
  try {
    const [rows] = await pool.execute(`
      SELECT l.*, 
             u.nombre as usuario_nombre, 
             p.nombre as plan_nombre, 
             e.nombre as empresa_nombre,
             DATEDIFF(l.fecha_renovacion, CURDATE()) as dias_para_renovacion,
             CASE 
               WHEN l.fecha_renovacion < CURDATE() THEN 'vencida'
               WHEN DATEDIFF(l.fecha_renovacion, CURDATE()) <= 7 THEN 'urgente'
               WHEN DATEDIFF(l.fecha_renovacion, CURDATE()) <= 30 THEN 'proxima'
               ELSE 'normal'
             END as estado_renovacion
      FROM lineas l 
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN planes p ON l.plan_id = p.id
      LEFT JOIN empresas e ON l.empresa_id = e.id
      WHERE l.fecha_renovacion <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
      AND l.estado = 'activa'
      ORDER BY l.fecha_renovacion ASC
    `, [dias]);
    return rows;
  } catch (error) {
    console.error('Error obteniendo líneas próximas a renovación:', error);
    throw error;
  }
};

// Obtener resumen de renovaciones por período
const getResumenRenovaciones = async (pool) => {
  try {
    const [proximos7] = await pool.execute(`
      SELECT COUNT(*) as total FROM lineas 
      WHERE fecha_renovacion BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      AND estado = 'activa'
    `);
    
    const [proximos30] = await pool.execute(`
      SELECT COUNT(*) as total FROM lineas 
      WHERE fecha_renovacion BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      AND estado = 'activa'
    `);
    
    const [vencidas] = await pool.execute(`
      SELECT COUNT(*) as total FROM lineas 
      WHERE fecha_renovacion < CURDATE()
      AND estado = 'activa'
    `);

    return {
      proximos7Dias: proximos7[0].total,
      proximos30Dias: proximos30[0].total,
      vencidas: vencidas[0].total
    };
  } catch (error) {
    console.error('Error obteniendo resumen de renovaciones:', error);
    throw error;
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  getPlanes,
  createPlan,
  updatePlan,
  deletePlan,
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  getLineas,
  createLinea,
  updateLinea,
  deleteLinea,
  getDashboardStats,
  getLineasProximasRenovacion,
  getResumenRenovaciones
};
