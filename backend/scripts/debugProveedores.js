require('dotenv').config();
const mysql = require('mysql2/promise');

async function debugProveedores() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('🔍 Verificando proveedores...');
        const [proveedores] = await connection.execute('SELECT * FROM proveedores');
        console.log('📋 Proveedores encontrados:', proveedores.length);
        proveedores.forEach(p => {
            console.log(`   ID: ${p.id}, Nombre: ${p.nombre}, Contacto: ${p.contacto}`);
        });

        console.log('\n🔍 Verificando líneas con proveedor...');
        const [lineas] = await connection.execute(`
            SELECT 
                l.id,
                l.numero,
                l.proveedor_id,
                pr.nombre as proveedor_nombre,
                pr.contacto as proveedor_contacto
            FROM lineas l
            LEFT JOIN proveedores pr ON l.proveedor_id = pr.id
            LIMIT 10
        `);
        
        console.log('📋 Primeras 10 líneas:');
        lineas.forEach(l => {
            console.log(`   ID: ${l.id}, Número: ${l.numero}, Proveedor ID: ${l.proveedor_id}, Proveedor: ${l.proveedor_nombre || 'Sin proveedor'}`);
        });

        console.log('\n🔍 Verificando query actual del backend...');
        const [lineasCompletas] = await connection.execute(`
            SELECT 
                l.id,
                l.numero,
                l.tipo_plan_id,
                l.empresa_id,
                l.usuario_id,
                l.proveedor_id,
                l.fecha_activacion,
                l.fecha_vencimiento,
                l.estado,
                tp.nombre as plan_nombre,
                tp.precio as plan_precio,
                e.nombre as empresa_nombre,
                u.nombre as usuario_nombre,
                pr.nombre as proveedor_nombre,
                pr.contacto as proveedor_contacto,
                CONCAT(pr.nombre, ' - ', pr.contacto) as proveedor_display
            FROM lineas l
            LEFT JOIN planes tp ON l.tipo_plan_id = tp.id
            LEFT JOIN empresas e ON l.empresa_id = e.id
            LEFT JOIN usuarios u ON l.usuario_id = u.id
            LEFT JOIN proveedores pr ON l.proveedor_id = pr.id
            WHERE l.estado = 'activo'
            LIMIT 5
        `);

        console.log('📋 Query completa (primeras 5):');
        lineasCompletas.forEach(l => {
            console.log(`   ID: ${l.id}, Número: ${l.numero}`);
            console.log(`   Proveedor ID: ${l.proveedor_id}`);
            console.log(`   Proveedor Nombre: ${l.proveedor_nombre}`);
            console.log(`   Proveedor Display: ${l.proveedor_display}`);
            console.log('   ---');
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

debugProveedores();
