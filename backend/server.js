const express = require('express');
const cors = require('cors');
// const { pool } = require('./config/database'); // Comentado temporalmente

// Rutas (comentadas para usar mock data)
// const usuariosRoutes = require('./routes/usuarios');
// const lineasRoutes = require('./routes/lineas');
// const proveedoresRoutes = require('./routes/proveedores');
// const empresasRoutes = require('./routes/empresas');
// const planesRoutes = require('./routes/planes');

const app = express();
const PORT = process.env.PORT || 3002;

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
  origin: ['http://localhost:3000', 'http://localhost:3001'], // URLs del frontend
  credentials: true
}));
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

// Rutas temporales con datos mock (mientras se soluciona la BD)
app.get('/api/usuarios', (req, res) => {
  console.log('📋 GET /api/usuarios - Devolviendo:', mockUsuarios.length, 'usuarios');
  res.json(mockUsuarios);
});

app.get('/api/empresas', (req, res) => {
  console.log('📋 GET /api/empresas - Devolviendo:', mockEmpresas.length, 'empresas');
  res.json(mockEmpresas);
});

app.get('/api/planes', (req, res) => {
  console.log('📋 GET /api/planes - Devolviendo:', mockPlanes.length, 'planes');
  res.json(mockPlanes);
});

app.get('/api/proveedores', (req, res) => {
  console.log('📋 GET /api/proveedores - Devolviendo:', mockProveedores.length, 'proveedores');
  res.json(mockProveedores);
});

app.get('/api/lineas', (req, res) => {
  console.log('📋 GET /api/lineas - Devolviendo:', mockLineas.length, 'líneas');
  res.json(mockLineas);
});

// Rutas POST/PUT/DELETE temporales con respuestas mock
app.post('/api/usuarios', (req, res) => {
  console.log('➕ POST /api/usuarios - Datos recibidos:', req.body);
  const newUser = { 
    id: Date.now(), 
    ...req.body, 
    created_at: new Date(), 
    updated_at: new Date() 
  };
  mockUsuarios.push(newUser);
  console.log('✅ Usuario creado y agregado al array:', newUser);
  console.log('📊 Total usuarios ahora:', mockUsuarios.length);
  res.status(201).json(newUser);
});

app.put('/api/usuarios/:id', (req, res) => {
  console.log('✏️ PUT /api/usuarios/:id - Datos recibidos:', req.body);
  const id = parseInt(req.params.id);
  const userIndex = mockUsuarios.findIndex(user => user.id === id);
  
  if (userIndex !== -1) {
    mockUsuarios[userIndex] = {
      ...mockUsuarios[userIndex],
      ...req.body,
      id: id,
      updated_at: new Date()
    };
    console.log('✅ Usuario actualizado en el array:', mockUsuarios[userIndex]);
    res.json(mockUsuarios[userIndex]);
  } else {
    console.log('❌ Usuario no encontrado con ID:', id);
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

app.delete('/api/usuarios/:id', (req, res) => {
  console.log('🗑️ DELETE /api/usuarios/:id - ID:', req.params.id);
  const id = parseInt(req.params.id);
  const userIndex = mockUsuarios.findIndex(user => user.id === id);
  
  if (userIndex !== -1) {
    const deletedUser = mockUsuarios.splice(userIndex, 1)[0];
    console.log('✅ Usuario eliminado del array:', deletedUser);
    console.log('📊 Total usuarios ahora:', mockUsuarios.length);
    res.json({ message: 'Usuario eliminado correctamente' });
  } else {
    console.log('❌ Usuario no encontrado con ID:', id);
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

app.post('/api/empresas', (req, res) => {
  console.log('➕ POST /api/empresas - Datos recibidos:', req.body);
  const newEmpresa = { 
    id: Date.now(), 
    ...req.body, 
    created_at: new Date(), 
    updated_at: new Date() 
  };
  mockEmpresas.push(newEmpresa);
  console.log('✅ Empresa creada y agregada al array:', newEmpresa);
  res.status(201).json(newEmpresa);
});

app.put('/api/empresas/:id', (req, res) => {
  console.log('✏️ PUT /api/empresas/:id - Datos recibidos:', req.body);
  const id = parseInt(req.params.id);
  const empresaIndex = mockEmpresas.findIndex(empresa => empresa.id === id);
  
  if (empresaIndex !== -1) {
    mockEmpresas[empresaIndex] = {
      ...mockEmpresas[empresaIndex],
      ...req.body,
      id: id,
      updated_at: new Date()
    };
    console.log('✅ Empresa actualizada en el array:', mockEmpresas[empresaIndex]);
    res.json(mockEmpresas[empresaIndex]);
  } else {
    res.status(404).json({ error: 'Empresa no encontrada' });
  }
});

app.delete('/api/empresas/:id', (req, res) => {
  console.log('🗑️ DELETE /api/empresas/:id - ID:', req.params.id);
  const id = parseInt(req.params.id);
  const empresaIndex = mockEmpresas.findIndex(empresa => empresa.id === id);
  
  if (empresaIndex !== -1) {
    mockEmpresas.splice(empresaIndex, 1);
    res.json({ message: 'Empresa eliminada correctamente' });
  } else {
    res.status(404).json({ error: 'Empresa no encontrada' });
  }
});

app.post('/api/planes', (req, res) => {
  const newPlan = { 
    id: Date.now(), 
    ...req.body, 
    created_at: new Date(), 
    updated_at: new Date() 
  };
  res.status(201).json(newPlan);
});

app.put('/api/planes/:id', (req, res) => {
  const updatedPlan = { 
    id: parseInt(req.params.id), 
    ...req.body, 
    updated_at: new Date() 
  };
  res.json(updatedPlan);
});

app.delete('/api/planes/:id', (req, res) => {
  res.json({ message: 'Plan eliminado correctamente' });
});

app.post('/api/proveedores', (req, res) => {
  const newProveedor = { 
    id: Date.now(), 
    ...req.body, 
    created_at: new Date(), 
    updated_at: new Date() 
  };
  res.status(201).json(newProveedor);
});

app.put('/api/proveedores/:id', (req, res) => {
  const updatedProveedor = { 
    id: parseInt(req.params.id), 
    ...req.body, 
    updated_at: new Date() 
  };
  res.json(updatedProveedor);
});

app.delete('/api/proveedores/:id', (req, res) => {
  res.json({ message: 'Proveedor eliminado correctamente' });
});

app.post('/api/lineas', (req, res) => {
  const newLinea = { 
    id: Date.now(), 
    ...req.body, 
    created_at: new Date(), 
    updated_at: new Date() 
  };
  res.status(201).json(newLinea);
});

app.put('/api/lineas/:id', (req, res) => {
  const updatedLinea = { 
    id: parseInt(req.params.id), 
    ...req.body, 
    updated_at: new Date() 
  };
  res.json(updatedLinea);
});

app.delete('/api/lineas/:id', (req, res) => {
  res.json({ message: 'Línea eliminada correctamente' });
});

// Registrar rutas (comentadas para usar las rutas mock de arriba)
// app.use('/api/usuarios', usuariosRoutes);
// app.use('/api/lineas', lineasRoutes);
// app.use('/api/proveedores', proveedoresRoutes);
// app.use('/api/empresas', empresasRoutes);
// app.use('/api/planes', planesRoutes);

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('🔄 Usando datos mock temporalmente (MySQL no conectado)');
  console.log('📡 API endpoints disponibles:');
  console.log('   GET /api/usuarios');
  console.log('   GET /api/empresas');
  console.log('   GET /api/planes');
  console.log('   GET /api/proveedores');
  console.log('   GET /api/lineas');
  console.log('   POST/PUT/DELETE para todas las entidades');
});

module.exports = app;
