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
        lineasInactivas: mockLineas.filter(l => l.estado !== 'activa').length,
        lineasPorRenovar: 0,
        lineasVencidas: 0
      };
      res.json(stats);
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para líneas próximas a renovación
app.get('/api/lineas/renovaciones', async (req, res) => {
  try {
    const dias = req.query.dias || 30;
    if (USE_DATABASE && pool) {
      const lineas = await dbQueries.getLineasProximasRenovacion(pool, dias);
      res.json(lineas);
    } else {
      // Mock data para renovaciones
      const mockRenovaciones = [
        {
          id: 1,
          numero: '555-1001',
          usuario_nombre: 'Juan Pérez',
          empresa_nombre: 'TechCorp',
          plan_nombre: 'Plan Premium',
          fecha_renovacion: '2025-08-15',
          dias_para_renovacion: 13,
          estado_renovacion: 'proxima'
        }
      ];
      res.json(mockRenovaciones);
    }
  } catch (error) {
    console.error('Error obteniendo líneas próximas a renovación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para resumen de renovaciones
app.get('/api/dashboard/renovaciones', async (req, res) => {
  try {
    if (USE_DATABASE && pool) {
      const resumen = await dbQueries.getResumenRenovaciones(pool);
      res.json(resumen);
    } else {
      // Mock data para resumen
      const mockResumen = {
        proximos7Dias: 2,
        proximos30Dias: 8,
        vencidas: 3
      };
      res.json(mockResumen);
    }
  } catch (error) {
    console.error('Error obteniendo resumen de renovaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== FUNCIONES HELPERS ====================
const createCrudRoutes = (entity, mockData, dbQueries) => {
  // Mapear entidades a nombres de rutas
  const routeNameMap = {
    'Usuario': 'usuarios',
    'Empresa': 'empresas',
    'Plan': 'planes', 
    'Proveedor': 'proveedores',
    'Linea': 'lineas'
  };
  
  const entityName = routeNameMap[entity] || entity.toLowerCase();
  
  // Nombres de funciones en queries.js con casos especiales
  const functionNameMap = {
    'Usuario': { get: 'getUsuarios', create: 'createUsuario', update: 'updateUsuario', delete: 'deleteUsuario' },
    'Empresa': { get: 'getEmpresas', create: 'createEmpresa', update: 'updateEmpresa', delete: 'deleteEmpresa' },
    'Plan': { get: 'getPlanes', create: 'createPlan', update: 'updatePlan', delete: 'deletePlan' },
    'Proveedor': { get: 'getProveedores', create: 'createProveedor', update: 'updateProveedor', delete: 'deleteProveedor' },
    'Linea': { get: 'getLineas', create: 'createLinea', update: 'updateLinea', delete: 'deleteLinea' }
  };
  
  const getFunctionName = functionNameMap[entity]?.get || `get${entity}s`;
  const createFunctionName = functionNameMap[entity]?.create || `create${entity}`;
  const updateFunctionName = functionNameMap[entity]?.update || `update${entity}`;
  const deleteFunctionName = functionNameMap[entity]?.delete || `delete${entity}`;
  
  // GET - Obtener todos
  app.get(`/api/${entityName}`, async (req, res) => {
    try {
      if (USE_DATABASE && pool && dbQueries[getFunctionName]) {
        console.log(`📋 GET /api/${entityName} - Obteniendo de MySQL`);
        const data = await dbQueries[getFunctionName](pool);
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
      if (USE_DATABASE && pool && dbQueries[createFunctionName]) {
        console.log(`➕ POST /api/${entityName} - Creando en MySQL:`, req.body);
        const newItem = await dbQueries[createFunctionName](pool, req.body);
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

  // PUT - Actualizar existente
  app.put(`/api/${entityName}/:id`, async (req, res) => {
    try {
      const id = req.params.id;
      if (USE_DATABASE && pool && dbQueries[updateFunctionName]) {
        console.log(`🔄 PUT /api/${entityName}/${id} - Actualizando en MySQL:`, req.body);
        const updatedItem = await dbQueries[updateFunctionName](pool, id, req.body);
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
      if (USE_DATABASE && pool && dbQueries[deleteFunctionName]) {
        console.log(`🗑️  DELETE /api/${entityName}/${id} - Eliminando de MySQL`);
        await dbQueries[deleteFunctionName](pool, id);
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
createCrudRoutes('Usuario', mockUsuarios, dbQueries);
// createCrudRoutes('Empresa', mockEmpresas, dbQueries); // Comentado - usar rutas específicas
createCrudRoutes('Plan', mockPlanes, dbQueries);
createCrudRoutes('Proveedor', mockProveedores, dbQueries);
// createCrudRoutes('Linea', mockLineas, dbQueries); // Comentado - usar rutas específicas

// ==================== RUTAS ESPECÍFICAS DE EMPRESAS ====================
// Rutas específicas para empresas (incluyen relaciones con usuarios y líneas)
const empresaRoutes = require('./routes/empresas');
app.use('/api/empresas', empresaRoutes);

// ==================== RUTAS ESPECÍFICAS DE ASESORES ====================
// Rutas específicas para asesores (no usan el sistema CRUD genérico)
const asesorRoutes = require('./routes/asesores');
app.use('/api/asesores', asesorRoutes);

// ==================== RUTAS ESPECÍFICAS DE LÍNEAS ====================
// Rutas específicas para líneas (incluyen búsqueda por proveedor)
const lineaRoutes = require('./routes/lineas');
app.use('/api/lineas', lineaRoutes);

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
  console.log('   GET /api/asesores');
  console.log('   GET /api/asesores/proveedor/:id');
  console.log('   GET /api/asesores/puestos');
  console.log('   GET /api/dashboard/stats');
  console.log('   GET /api/lineas/renovaciones');
  console.log('   GET /api/dashboard/renovaciones');
  console.log('   POST/PUT/DELETE para todas las entidades');
});
