const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  let connection;
  
  try {
    console.log('🚀 Iniciando migraciones...');
    console.log(`📋 Configuración:`);
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Puerto: ${process.env.DB_PORT}`);
    console.log(`   Usuario: ${process.env.DB_USER}`);
    console.log(`   Base de datos: ${process.env.DB_NAME}`);

    // Intentar conectar con la base de datos específica
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
      });
      console.log(`✅ Conectado a la base de datos '${process.env.DB_NAME}'`);
    } catch (dbError) {
      console.log('⚠️  La base de datos no existe, intentando crearla...');
      
      // Conectar sin especificar la base de datos
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
      });

      // Crear la base de datos
      await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
      console.log(`✅ Base de datos '${process.env.DB_NAME}' creada`);
      
      // Reconectar con la nueva base de datos
      await connection.end();
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
      });
    }

    // Leer y ejecutar el archivo SQL
    const sqlPath = path.join(__dirname, '..', 'sql', 'schema.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    
    // Dividir por declaraciones (separadas por punto y coma)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`📄 Ejecutando ${statements.length} declaraciones SQL...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await connection.execute(statement);
          console.log(`✅ Declaración ${i + 1}/${statements.length} ejecutada`);
        } catch (error) {
          console.log(`⚠️  Declaración ${i + 1}: ${error.message}`);
        }
      }
    }

    // Verificar que las tablas se crearon
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Tablas creadas:');
    tables.forEach(table => {
      console.log(`   ✅ ${Object.values(table)[0]}`);
    });

    console.log('\n🎉 Migraciones completadas exitosamente!');

  } catch (error) {
    console.error('\n❌ Error durante las migraciones:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verificar que MySQL esté corriendo');
    console.log('   2. Verificar las credenciales en el archivo .env');
    console.log('   3. Verificar que el puerto sea correcto');
    console.log('   4. Si usas XAMPP, asegúrate de que MySQL esté iniciado');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigrations();
