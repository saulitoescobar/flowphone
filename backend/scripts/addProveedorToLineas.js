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

async function addProveedorToLineas() {
    try {
        // Crear la conexión
        const connection = await mysql.createConnection(dbConfig);
        
        console.log('🔗 Conectado a la base de datos...');
        
        // Verificar si la columna proveedor_id ya existe
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'lineas' 
            AND TABLE_SCHEMA = ? 
            AND COLUMN_NAME = 'proveedor_id'
        `, [dbConfig.database]);
        
        if (columns.length > 0) {
            console.log('✅ La columna proveedor_id ya existe en la tabla lineas');
        } else {
            // Agregar la columna proveedor_id
            await connection.execute(`
                ALTER TABLE lineas 
                ADD COLUMN proveedor_id INT AFTER empresa_id,
                ADD FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
            `);
            console.log('✅ Columna proveedor_id agregada exitosamente a la tabla lineas');
        }
        
        // Actualizar líneas existentes con proveedores basados en sus planes
        console.log('🔄 Actualizando líneas existentes con proveedores...');
        
        const [lineasSinProveedor] = await connection.execute(`
            SELECT l.id, l.numero, p.proveedor_id 
            FROM lineas l 
            LEFT JOIN planes p ON l.plan_id = p.id 
            WHERE l.proveedor_id IS NULL AND p.proveedor_id IS NOT NULL
        `);
        
        console.log(`📋 Encontradas ${lineasSinProveedor.length} líneas para actualizar`);
        
        for (const linea of lineasSinProveedor) {
            await connection.execute(
                'UPDATE lineas SET proveedor_id = ? WHERE id = ?',
                [linea.proveedor_id, linea.id]
            );
            console.log(`✅ Línea ${linea.numero} (ID: ${linea.id}) → Proveedor ID: ${linea.proveedor_id}`);
        }
        
        // Para líneas sin plan, asignar el primer proveedor disponible
        const [lineasSinPlan] = await connection.execute(`
            SELECT l.id, l.numero 
            FROM lineas l 
            WHERE l.proveedor_id IS NULL
        `);
        
        if (lineasSinPlan.length > 0) {
            // Obtener el primer proveedor
            const [proveedores] = await connection.execute('SELECT id FROM proveedores ORDER BY id LIMIT 1');
            
            if (proveedores.length > 0) {
                const proveedorDefault = proveedores[0].id;
                
                for (const linea of lineasSinPlan) {
                    await connection.execute(
                        'UPDATE lineas SET proveedor_id = ? WHERE id = ?',
                        [proveedorDefault, linea.id]
                    );
                    console.log(`✅ Línea ${linea.numero} (ID: ${linea.id}) → Proveedor por defecto: ${proveedorDefault}`);
                }
            }
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
        
        // Cerrar la conexión
        await connection.end();
        console.log('\n🎉 Migración completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error.message);
        process.exit(1);
    }
}

// Ejecutar la migración
console.log('🚀 Iniciando migración para agregar proveedor a líneas...\n');
addProveedorToLineas();
