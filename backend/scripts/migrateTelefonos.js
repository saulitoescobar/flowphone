const { pool } = require('../config/database');

async function migrateTelefonos() {
  try {
    console.log('Migrando números de teléfono...');
    
    // Copiar datos de linea a telefono
    const [result] = await pool.execute(
      'UPDATE usuarios SET telefono = linea WHERE linea IS NOT NULL AND telefono IS NULL'
    );
    
    console.log(`✅ ${result.affectedRows} teléfonos migrados de linea a telefono`);
    
    // Verificar resultado
    const [usuarios] = await pool.execute(`
      SELECT id, nombre, email, telefono, empresa 
      FROM usuarios 
      ORDER BY id
    `);
    
    console.log('\n📋 Usuarios después de la migración:');
    usuarios.forEach(user => {
      console.log(`- ${user.nombre}: ${user.telefono || 'Sin teléfono'} | ${user.empresa || 'Sin empresa'}`);
    });
    
    console.log('\n🎉 Migración de teléfonos completada');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await pool.end();
  }
}

migrateTelefonos();
