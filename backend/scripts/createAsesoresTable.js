const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'phoneflow_db',
  port: 3307,
  multipleStatements: true
};

async function createAsesoresTable() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('📖 Leyendo archivo SQL...');
    const sqlContent = fs.readFileSync(path.join(__dirname, '..', 'sql', 'asesores_table.sql'), 'utf8');
    
    console.log('⚡ Ejecutando script SQL...');
    await connection.execute(sqlContent);
    
    console.log('✅ Tabla de asesores creada exitosamente');
    
    // Ahora vamos a agregar los datos de ejemplo
    console.log('📊 Verificando proveedores existentes...');
    const [proveedores] = await connection.execute('SELECT id, nombre FROM proveedores ORDER BY id');
    console.log('📋 Proveedores encontrados:', proveedores);
    
    // Insertar asesores para los proveedores existentes
    if (proveedores.length > 0) {
      console.log('👥 Agregando asesores de ejemplo...');
      
      for (const proveedor of proveedores.slice(0, 3)) { // Solo los primeros 3 proveedores
        const ventas = `Asesor Ventas ${proveedor.nombre}`;
        const postVentas = `Asesor PostVentas ${proveedor.nombre}`;
        
        await connection.execute(`
          INSERT INTO asesores (proveedor_id, nombre, puesto, correo, telefono_fijo, telefono_movil) VALUES
          (?, ?, 'ventas', ?, '2333-1001', '5555-1001'),
          (?, ?, 'post_ventas', ?, '2333-1002', '5555-1002')
        `, [
          proveedor.id, ventas, `ventas@${proveedor.nombre.toLowerCase().replace(/\s+/g, '')}.com`,
          proveedor.id, postVentas, `postventas@${proveedor.nombre.toLowerCase().replace(/\s+/g, '')}.com`
        ]);
      }
      
      console.log('✅ Asesores de ejemplo agregados');
    }
    
  } catch (error) {
    console.error('❌ Error al crear tabla de asesores:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔐 Conexión cerrada');
    }
  }
}

createAsesoresTable();
