const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phoneflow_db',
  port: process.env.DB_PORT || 3306
};

async function addDpiToUsuarios() {
    try {
        // Crear la conexión
        const connection = await mysql.createConnection(dbConfig);
        
        console.log('Conectado a la base de datos...');
        
        // Verificar si la columna DPI ya existe
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'usuarios' 
            AND TABLE_SCHEMA = ? 
            AND COLUMN_NAME = 'dpi'
        `, [dbConfig.database]);
        
        if (columns.length > 0) {
            console.log('La columna DPI ya existe en la tabla usuarios');
        } else {
            // Agregar la columna DPI
            await connection.execute(`
                ALTER TABLE usuarios 
                ADD COLUMN dpi VARCHAR(20) AFTER email
            `);
            console.log('Columna DPI agregada exitosamente a la tabla usuarios');
            
            // Agregar algunos DPIs de ejemplo a los usuarios existentes
            const updateQueries = [
                { id: 1, dpi: '1234567890123' },
                { id: 2, dpi: '9876543210987' },
                { id: 3, dpi: '1357924680135' },
                { id: 4, dpi: '2468013579246' }
            ];
            
            for (const update of updateQueries) {
                try {
                    await connection.execute(
                        'UPDATE usuarios SET dpi = ? WHERE id = ?',
                        [update.dpi, update.id]
                    );
                    console.log(`DPI actualizado para usuario ID ${update.id}`);
                } catch (error) {
                    console.log(`Usuario ID ${update.id} no existe, saltando...`);
                }
            }
        }
        
        // Cerrar la conexión
        await connection.end();
        console.log('Migración completada exitosamente');
        
    } catch (error) {
        console.error('Error durante la migración:', error.message);
        process.exit(1);
    }
}

// Ejecutar la migración
addDpiToUsuarios();
