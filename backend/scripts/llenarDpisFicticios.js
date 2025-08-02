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

// Función para generar un DPI ficticio válido (13 dígitos)
function generarDpiFicticio() {
  let dpi = '';
  for (let i = 0; i < 13; i++) {
    dpi += Math.floor(Math.random() * 10);
  }
  return dpi;
}

async function llenarUsuariosConDpi() {
    try {
        // Crear la conexión
        const connection = await mysql.createConnection(dbConfig);
        
        console.log('🔗 Conectado a la base de datos...');
        
        // Obtener todos los usuarios que no tienen DPI o tienen DPI vacío
        const [usuarios] = await connection.execute(`
            SELECT id, nombre 
            FROM usuarios 
            WHERE dpi IS NULL OR dpi = ''
        `);
        
        console.log(`📋 Encontrados ${usuarios.length} usuarios sin DPI`);
        
        if (usuarios.length === 0) {
            console.log('✅ Todos los usuarios ya tienen DPI asignado');
            await connection.end();
            return;
        }
        
        // Actualizar cada usuario con un DPI ficticio único
        let actualizados = 0;
        const dpisUsados = new Set();
        
        for (const usuario of usuarios) {
            let dpiNuevo;
            
            // Generar un DPI único
            do {
                dpiNuevo = generarDpiFicticio();
            } while (dpisUsados.has(dpiNuevo));
            
            dpisUsados.add(dpiNuevo);
            
            try {
                await connection.execute(
                    'UPDATE usuarios SET dpi = ? WHERE id = ?',
                    [dpiNuevo, usuario.id]
                );
                
                console.log(`✅ Usuario "${usuario.nombre}" (ID: ${usuario.id}) → DPI: ${dpiNuevo}`);
                actualizados++;
                
            } catch (error) {
                console.error(`❌ Error actualizando usuario ${usuario.id}:`, error.message);
            }
        }
        
        // Verificar que no haya DPIs duplicados en toda la tabla
        const [duplicados] = await connection.execute(`
            SELECT dpi, COUNT(*) as count 
            FROM usuarios 
            WHERE dpi IS NOT NULL AND dpi != ''
            GROUP BY dpi 
            HAVING COUNT(*) > 1
        `);
        
        if (duplicados.length > 0) {
            console.log('⚠️  DPIs duplicados encontrados:');
            duplicados.forEach(dup => {
                console.log(`   DPI: ${dup.dpi} (${dup.count} veces)`);
            });
        } else {
            console.log('✅ No se encontraron DPIs duplicados');
        }
        
        // Mostrar estadísticas finales
        const [totalUsuarios] = await connection.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN dpi IS NOT NULL AND dpi != '' THEN 1 ELSE 0 END) as con_dpi,
                SUM(CASE WHEN dpi IS NULL OR dpi = '' THEN 1 ELSE 0 END) as sin_dpi
            FROM usuarios
        `);
        
        const stats = totalUsuarios[0];
        
        console.log('\n📊 ESTADÍSTICAS FINALES:');
        console.log(`   Total usuarios: ${stats.total}`);
        console.log(`   Con DPI: ${stats.con_dpi}`);
        console.log(`   Sin DPI: ${stats.sin_dpi}`);
        console.log(`   Actualizados en esta ejecución: ${actualizados}`);
        
        // Cerrar la conexión
        await connection.end();
        console.log('\n🎉 Proceso completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error durante el proceso:', error.message);
        process.exit(1);
    }
}

// Ejecutar el script
console.log('🚀 Iniciando script para llenar usuarios con DPIs ficticios...\n');
llenarUsuariosConDpi();
