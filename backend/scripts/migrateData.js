const { pool } = require('../config/database');

async function migrateData() {
  try {
    console.log('Migrando datos existentes...');
    
    // Obtener todos los usuarios con empresa_id
    const [usuarios] = await pool.execute(`
      SELECT u.id, u.nombre, u.empresa_id, e.nombre as empresa_nombre
      FROM usuarios u 
      LEFT JOIN empresas e ON u.empresa_id = e.id
      WHERE u.empresa_id IS NOT NULL
    `);
    
    console.log(`Encontrados ${usuarios.length} usuarios con empresa_id`);
    
    // Actualizar cada usuario con el nombre de la empresa
    for (const usuario of usuarios) {
      if (usuario.empresa_nombre) {
        await pool.execute(
          'UPDATE usuarios SET empresa = ? WHERE id = ?',
          [usuario.empresa_nombre, usuario.id]
        );
        console.log(`✅ Usuario ${usuario.nombre} actualizado con empresa: ${usuario.empresa_nombre}`);
      }
    }
    
    console.log('🎉 Migración de datos completada');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await pool.end();
  }
}

migrateData();
