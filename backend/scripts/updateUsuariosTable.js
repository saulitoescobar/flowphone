const { pool } = require('../config/database');

async function updateUsuariosTable() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Verificar si las columnas ya existen
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'usuarios' 
      AND TABLE_SCHEMA = 'phoneflow_db'
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Columnas actuales:', columnNames);
    
    // Agregar columna telefono si no existe
    if (!columnNames.includes('telefono')) {
      await pool.execute('ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(50) AFTER email');
      console.log('✅ Columna telefono agregada');
    } else {
      console.log('ℹ️ Columna telefono ya existe');
    }
    
    // Agregar columna empresa si no existe
    if (!columnNames.includes('empresa')) {
      await pool.execute('ALTER TABLE usuarios ADD COLUMN empresa VARCHAR(255) AFTER telefono');
      console.log('✅ Columna empresa agregada');
    } else {
      console.log('ℹ️ Columna empresa ya existe');
    }
    
    // Verificar el resultado
    const [newColumns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'usuarios' 
      AND TABLE_SCHEMA = 'phoneflow_db'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Columnas después de la actualización:', newColumns.map(col => col.COLUMN_NAME));
    console.log('🎉 Actualización completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error actualizando la tabla:', error);
  } finally {
    await pool.end();
  }
}

updateUsuariosTable();
