const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  let connection;
  
  try {
    // Conectar sin especificar la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ Conectado a MySQL');

    // Crear la base de datos si no existe
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Base de datos '${process.env.DB_NAME}' creada o ya existe`);

    // Usar la base de datos
    await connection.execute(`USE \`${process.env.DB_NAME}\``);
    console.log(`✅ Usando base de datos '${process.env.DB_NAME}'`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();
