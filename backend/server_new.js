const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

// Configuración de base de datos
const USE_DATABASE = process.env.USE_DATABASE === 'true';
let pool = null;

if (USE_DATABASE) {
  try {
    const { pool: dbPool, testConnection } = require('./config/database');
    pool = dbPool;
    testConnection();
  } catch (error) {
    console.warn('⚠️  No se pudo conectar a MySQL, usando datos mock');
    console.warn('   Error:', error.message);
  }
}

const app = express();
const PORT = process.env.BACKEND_PORT || 3002;

// Datos mock en memoria
let mockUsuarios = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@empresa.com', telefono: '3001234567', empresa: 'TechCorp', empresa_id: 1, created_at: new Date(), updated_at: new Date() },
  { id: 2, nombre: 'María García', email: 'maria@empresa.com', telefono: '3001234568', empresa: 'DataSoft', empresa_id: 2, created_at: new Date(), updated_at: new Date() }
];

let mockEmpresas = [
  { id: 1, nombre: 'TechCorp S.A.', direccion: 'Calle 123 #45-67', telefono: '6015551234', nit: '900123456-1', created_at: new Date(), updated_at: new Date() },
  { id: 2, nombre: 'DataSoft Ltda.', direccion: 'Carrera 45 #12-34', telefono: '6015555678', nit: '800987654-2', created_at: new Date(), updated_at: new Date() }
];

let mockPlanes = [
  { id: 1, nombre: 'Plan Básico', descripcion: 'Plan básico con llamadas ilimitadas', precio: 25000, created_at: new Date(), updated_at: new Date() },
  { id: 2, nombre: 'Plan Premium', descripcion: 'Plan premium con datos y llamadas', precio: 45000, created_at: new Date(), updated_at: new Date() }
];

let mockProveedores = [
  { id: 1, nombre: 'Claro Colombia', contacto: 'Carlos López', telefono: '3001111111', created_at: new Date(), updated_at: new Date() },
  { id: 2, nombre: 'Movistar Colombia', contacto: 'Ana Rodríguez', telefono: '3002222222', created_at: new Date(), updated_at: new Date() }
];

let mockLineas = [
  { 
    id: 1, 
    numero: '3001234567', 
    estado: 'activa', 
    fecha_activacion: '2024-01-15',
    usuario_nombre: 'Juan Pérez',
    empresa_nombre: 'TechCorp S.A.',
    plan_nombre: 'Plan Básico',
    created_at: new Date(), 
    updated_at: new Date() 
  },
  { 
    id: 2, 
    numero: '3001234568', 
    estado: 'activa', 
    fecha_activacion: '2024-01-20',
    usuario_nombre: 'María García',
    empresa_nombre: 'DataSoft Ltda.',
    plan_nombre: 'Plan Premium',
    created_at: new Date(), 
    updated_at: new Date() 
  }
];

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Importar funciones de base de datos
const dbQueries = pool ? require('./database/queries') : null;

// ==================== RUTAS GENERALES ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente', 
    timestamp: new Date().toISOString(),
    database: USE_DATABASE && pool ? 'MySQL conectado' : 'Usando datos mock'
  });
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    if (USE_DATABASE && pool) {
      const stats = await dbQueries.getDashboardStats(pool);
      res.json(stats);
    } else {
      const stats = {
        usuarios: mockUsuarios.length,
        empresas: mockEmpresas.length,
        lineas: mockLineas.length,
        planes: mockPlanes.length,
        proveedores: mockProveedores.length,
        lineasActivas: mockLineas.filter(l => l.estado === 'activa').length,
        lineasInactivas: mockLineas.filter(l => l.estado !== 'activa').length
      };
      res.json(stats);
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== FUNCIONES HELPERS ====================
const createCrudRoutes = (entity, mockData, dbQueries) => {
  const entityName = entity.toLowerCase();
  
  // GET - Obtener todos
  app.get(`/api/${entityName}`, async (req, res) => {
    try {
      if (USE_DATABASE && pool && dbQueries[`get${entity}`]) {
        console.log(`📋 GET /api/${entityName} - Obteniendo de MySQL`);
        const data = await dbQueries[`get${entity}`](pool);
        res.json(data);
      } else {
        console.log(`📋 GET /api/${entityName} - Usando datos mock:`, mockData.length, entityName);
        res.json(mockData);
      }
    } catch (error) {
      console.error(`Error obteniendo ${entityName}:`, error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // POST - Crear nuevo
  app.post(`/api/${entityName}`, async (req, res) => {
    try {
      if (USE_DATABASE && pool && dbQueries[`create${entity}`]) {
        console.log(`➕ POST /api/${entityName} - Creando en MySQL:`, req.body);
        const newItem = await dbQueries[`create${entity}`](pool, req.body);
        res.json(newItem);
      } else {
        console.log(`➕ POST /api/${entityName} - Mock data:`, req.body);
        const newItem = { 
          id: Date.now(), 
          ...req.body, 
          created_at: new Date(), 
          updated_at: new Date() 
        };
        mockData.push(newItem);
        res.json(newItem);
      }
    } catch (error) {
      console.error(`Error creando ${entityName}:`, error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // PUT - Actualizar
  app.put(`/api/${entityName}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      if (USE_DATABASE && pool && dbQueries[`update${entity}`]) {
        console.log(`🔄 PUT /api/${entityName}/${id} - Actualizando en MySQL`);
        const updatedItem = await dbQueries[`update${entity}`](pool, id, req.body);
        res.json(updatedItem);
      } else {
        console.log(`🔄 PUT /api/${entityName}/${id} - Mock data:`, req.body);
        const index = mockData.findIndex(item => item.id == id);
        if (index !== -1) {
          mockData[index] = { ...mockData[index], ...req.body, updated_at: new Date() };
          res.json(mockData[index]);
        } else {
          res.status(404).json({ error: `${entity} no encontrado` });
        }
      }
    } catch (error) {
      console.error(`Error actualizando ${entityName}:`, error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // DELETE - Eliminar
  app.delete(`/api/${entityName}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      if (USE_DATABASE && pool && dbQueries[`delete${entity}`]) {
        console.log(`🗑️  DELETE /api/${entityName}/${id} - Eliminando de MySQL`);
        await dbQueries[`delete${entity}`](pool, id);
        res.json({ message: `${entity} eliminado correctamente` });
      } else {
        console.log(`🗑️  DELETE /api/${entityName}/${id} - Mock data`);
        const index = mockData.findIndex(item => item.id == id);
        if (index !== -1) {
          mockData.splice(index, 1);
          res.json({ message: `${entity} eliminado correctamente` });
        } else {
          res.status(404).json({ error: `${entity} no encontrado` });
        }
      }
    } catch (error) {
      console.error(`Error eliminando ${entityName}:`, error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
};

// ==================== CREAR RUTAS CRUD ====================
createCrudRoutes('Usuarios', mockUsuarios, dbQueries);
createCrudRoutes('Empresas', mockEmpresas, dbQueries);
createCrudRoutes('Planes', mockPlanes, dbQueries);
createCrudRoutes('Proveedores', mockProveedores, dbQueries);
createCrudRoutes('Lineas', mockLineas, dbQueries);

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔄 Usando ${USE_DATABASE && pool ? 'base de datos MySQL' : 'datos mock temporalmente'}`);
  console.log('📡 API endpoints disponibles:');
  console.log('   GET /api/usuarios');
  console.log('   GET /api/empresas');
  console.log('   GET /api/planes');
  console.log('   GET /api/proveedores');
  console.log('   GET /api/lineas');
  console.log('   GET /api/dashboard/stats');
  console.log('   POST/PUT/DELETE para todas las entidades');
});
