const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const fs = require('fs');

const setupDatabase = async () => {
  console.log('🚀 Configurando base de datos FlowPhone...');
  
  // Configuración de conexión inicial (sin especificar database)
  const initialConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  };

  try {
    // Conexión inicial para crear la base de datos
    console.log('📡 Conectando a MySQL...');
    const connection = await mysql.createConnection(initialConfig);
    
    // Crear base de datos si no existe
    console.log('🗄️  Creando base de datos flowphone_db...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS flowphone_db`);
    await connection.query(`USE flowphone_db`);
    
    // Leer y ejecutar schema
    console.log('📋 Creando tablas...');
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Ejecutar todo el schema de una vez
    await connection.query(schema);
    
    console.log('✅ Base de datos configurada correctamente!');
    console.log('🎯 Datos de ejemplo insertados desde schema.sql');
    console.log('🌐 Puedes cambiar USE_DATABASE=true en .env para usar MySQL');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error.message);
    console.log('💡 Asegúrate de que MySQL esté corriendo y las credenciales sean correctas');
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
