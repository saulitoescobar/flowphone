require('dotenv').config();
const mysql = require('mysql2/promise');

async function debugBackendQuery() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('🔍 Ejecutando query exacta del backend...');
        const [rows] = await connection.execute(`
          SELECT l.*, 
                 u.nombre as usuario_nombre,
                 u.dpi as usuario_dpi,
                 p.nombre as plan_nombre, 
                 p.precio, 
                 p.datos, 
                 p.llamadas,
                 e.nombre as empresa_nombre,
                 e.nit as empresa_nit,
                 pr.nombre as proveedor_nombre,
                 pr.contacto as proveedor_contacto
          FROM lineas l 
          LEFT JOIN usuarios u ON l.usuario_id = u.id
          LEFT JOIN planes p ON l.plan_id = p.id
          LEFT JOIN empresas e ON l.empresa_id = e.id
          LEFT JOIN proveedores pr ON l.proveedor_id = pr.id
          ORDER BY l.created_at DESC
          LIMIT 5
        `);
        
        console.log('📋 Resultado del query (primeras 5 líneas):');
        rows.forEach((row, index) => {
            console.log(`\n--- Línea ${index + 1} ---`);
            console.log(`ID: ${row.id}`);
            console.log(`Número: ${row.numero}`);
            console.log(`Proveedor ID: ${row.proveedor_id}`);
            console.log(`Proveedor Nombre: ${row.proveedor_nombre}`);
            console.log(`Proveedor Contacto: ${row.proveedor_contacto}`);
            console.log(`Usuario ID: ${row.usuario_id}`);
            console.log(`Usuario Nombre: ${row.usuario_nombre}`);
            console.log(`Plan ID: ${row.plan_id}`);
            console.log(`Plan Nombre: ${row.plan_nombre}`);
            console.log('Todos los campos:', Object.keys(row));
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

debugBackendQuery();
