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

async function asignarProveedoresALineas() {
    try {
        // Crear la conexión
        const connection = await mysql.createConnection(dbConfig);
        
        console.log('🔗 Conectado a la base de datos...');
        
        // Obtener todas las líneas sin proveedor
        const [lineasSinProveedor] = await connection.execute(`
            SELECT id, numero 
            FROM lineas 
            WHERE proveedor_id IS NULL
        `);
        
        console.log(`📋 Encontradas ${lineasSinProveedor.length} líneas sin proveedor`);
        
        if (lineasSinProveedor.length === 0) {
            console.log('✅ Todas las líneas ya tienen proveedor asignado');
            await connection.end();
            return;
        }
        
        // Obtener los proveedores guatemaltecos (Tigo, Claro, Movistar, Red Móvil)
        const [proveedores] = await connection.execute(`
            SELECT id, nombre 
            FROM proveedores 
            WHERE nombre IN ('Tigo', 'Claro', 'Movistar', 'Red Móvil')
            ORDER BY id
        `);
        
        console.log(`📡 Proveedores disponibles: ${proveedores.map(p => p.nombre).join(', ')}`);
        
        if (proveedores.length === 0) {
            console.log('❌ No se encontraron proveedores guatemaltecos');
            await connection.end();
            return;
        }
        
        // Asignar proveedores de forma aleatoria a las líneas
        let actualizadas = 0;
        
        for (const linea of lineasSinProveedor) {
            // Seleccionar proveedor aleatorio
            const proveedorAleatorio = proveedores[Math.floor(Math.random() * proveedores.length)];
            
            await connection.execute(
                'UPDATE lineas SET proveedor_id = ? WHERE id = ?',
                [proveedorAleatorio.id, linea.id]
            );
            
            console.log(`✅ Línea ${linea.numero} (ID: ${linea.id}) → ${proveedorAleatorio.nombre}`);
            actualizadas++;
        }
        
        // Mostrar estadísticas finales
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(*) as total_lineas,
                SUM(CASE WHEN proveedor_id IS NOT NULL THEN 1 ELSE 0 END) as con_proveedor,
                SUM(CASE WHEN proveedor_id IS NULL THEN 1 ELSE 0 END) as sin_proveedor
            FROM lineas
        `);
        
        const estadisticas = stats[0];
        
        console.log('\n📊 ESTADÍSTICAS FINALES:');
        console.log(`   Total líneas: ${estadisticas.total_lineas}`);
        console.log(`   Con proveedor: ${estadisticas.con_proveedor}`);
        console.log(`   Sin proveedor: ${estadisticas.sin_proveedor}`);
        console.log(`   Actualizadas en esta ejecución: ${actualizadas}`);
        
        // Mostrar distribución por proveedor
        const [distribucion] = await connection.execute(`
            SELECT p.nombre, COUNT(l.id) as cantidad_lineas
            FROM proveedores p
            LEFT JOIN lineas l ON p.id = l.proveedor_id
            WHERE p.nombre IN ('Tigo', 'Claro', 'Movistar', 'Red Móvil')
            GROUP BY p.id, p.nombre
            ORDER BY cantidad_lineas DESC
        `);
        
        console.log('\n📈 DISTRIBUCIÓN POR PROVEEDOR:');
        distribucion.forEach(d => {
            console.log(`   ${d.nombre}: ${d.cantidad_lineas} líneas`);
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
console.log('🚀 Iniciando asignación de proveedores a líneas...\n');
asignarProveedoresALineas();
