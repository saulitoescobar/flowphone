const { pool } = require('../config/database');

async function addNitToEmpresas() {
  try {
    console.log('Agregando campo NIT a la tabla empresas...');
    
    // Verificar si la columna NIT ya existe
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'empresas' 
      AND TABLE_SCHEMA = 'phoneflow_db'
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('Columnas actuales en empresas:', columnNames);
    
    // Agregar columna nit si no existe
    if (!columnNames.includes('nit')) {
      await pool.execute('ALTER TABLE empresas ADD COLUMN nit VARCHAR(50) AFTER nombre');
      console.log('✅ Columna nit agregada a empresas');
    } else {
      console.log('ℹ️ Columna nit ya existe en empresas');
    }
    
    // Verificar el resultado
    const [newColumns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'empresas' 
      AND TABLE_SCHEMA = 'phoneflow_db'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Columnas después de la actualización:', newColumns.map(col => col.COLUMN_NAME));
    console.log('🎉 Actualización de empresas completada');
    
  } catch (error) {
    console.error('❌ Error actualizando empresas:', error);
  } finally {
    await pool.end();
  }
}

addNitToEmpresas();
