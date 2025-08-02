const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function testConnection() {
  const configs = [
    {
      name: 'Con contraseña vacía',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: '',
      }
    },
    {
      name: 'Sin contraseña',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
      }
    },
    {
      name: 'Con contraseña "root"',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: 'root',
      }
    },
    {
      name: 'Puerto estándar MySQL (3306)',
      config: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: '',
      }
    }
  ];

  for (const { name, config } of configs) {
    try {
      console.log(`🔍 Probando: ${name}`);
      const connection = await mysql.createConnection(config);
      console.log(`✅ ¡Conexión exitosa con: ${name}!`);
      
      // Mostrar las bases de datos disponibles
      const [databases] = await connection.execute('SHOW DATABASES');
      console.log('📊 Bases de datos disponibles:', databases.map(db => Object.values(db)[0]).join(', '));
      
      await connection.end();
      console.log('🎯 Usar esta configuración en tu .env\n');
      break;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }
}

testConnection();
