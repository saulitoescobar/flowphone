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

async function agregarProveedoresGuatemala() {
    try {
        // Crear la conexión
        const connection = await mysql.createConnection(dbConfig);
        
        console.log('🔗 Conectado a la base de datos...');
        
        // Proveedores de telefonía en Guatemala
        const proveedores = [
            {
                nombre: 'Tigo',
                contacto: 'atencion@tigo.com.gt',
                telefono: '1515'
            },
            {
                nombre: 'Claro',
                contacto: 'servicio@claro.com.gt',
                telefono: '123'
            },
            {
                nombre: 'Movistar',
                contacto: 'info@movistar.com.gt',
                telefono: '100'
            },
            {
                nombre: 'Red Móvil',
                contacto: 'contacto@redmovil.com.gt',
                telefono: '171'
            }
        ];
        
        console.log('📡 Agregando proveedores de telefonía de Guatemala...');
        
        for (const proveedor of proveedores) {
            // Verificar si el proveedor ya existe
            const [existing] = await connection.execute(
                'SELECT id FROM proveedores WHERE nombre = ?',
                [proveedor.nombre]
            );
            
            if (existing.length === 0) {
                // Insertar nuevo proveedor
                const [result] = await connection.execute(
                    'INSERT INTO proveedores (nombre, contacto, telefono) VALUES (?, ?, ?)',
                    [proveedor.nombre, proveedor.contacto, proveedor.telefono]
                );
                console.log(`✅ Proveedor "${proveedor.nombre}" agregado con ID: ${result.insertId}`);
            } else {
                console.log(`ℹ️ Proveedor "${proveedor.nombre}" ya existe con ID: ${existing[0].id}`);
            }
        }
        
        // Mostrar todos los proveedores
        const [allProveedores] = await connection.execute('SELECT * FROM proveedores ORDER BY id');
        
        console.log('\n📋 PROVEEDORES DISPONIBLES:');
        allProveedores.forEach(p => {
            console.log(`   ${p.id}: ${p.nombre} - ${p.contacto} (${p.telefono})`);
        });
        
        // Cerrar la conexión
        await connection.end();
        console.log('\n🎉 Proceso completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante el proceso:', error.message);
        process.exit(1);
    }
}

// Ejecutar el script
console.log('🚀 Iniciando script para agregar proveedores de Guatemala...\n');
agregarProveedoresGuatemala();
