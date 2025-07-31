const mysql = require('mysql2/promise');
require('dotenv').config();

async function testCurrentConfig() {
  console.log('🔍 Probando configuración actual del .env:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Puerto: ${process.env.DB_PORT}`);
  console.log(`   Usuario: ${process.env.DB_USER}`);
  console.log(`   Contraseña: ${process.env.DB_PASSWORD ? '***' : '(vacía)'}`);
  console.log(`   Base de datos: ${process.env.DB_NAME}`);

  try {
    // Primero probar conexión sin especificar base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('✅ ¡Conexión exitosa a MySQL!');
    
    // Mostrar las bases de datos disponibles
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📊 Bases de datos disponibles:');
    databases.forEach(db => {
      console.log(`   - ${Object.values(db)[0]}`);
    });

    // Verificar si existe la base de datos del proyecto
    const dbExists = databases.some(db => Object.values(db)[0] === process.env.DB_NAME);
    if (dbExists) {
      console.log(`✅ La base de datos '${process.env.DB_NAME}' ya existe`);
    } else {
      console.log(`⚠️  La base de datos '${process.env.DB_NAME}' no existe, se creará`);
    }

    await connection.end();
    return true;

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

testCurrentConfig();
