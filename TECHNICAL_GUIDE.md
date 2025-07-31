# Guía Técnica del Proyecto

## 🚀 Quick Start para Nuevas Máquinas

### 1. Clonar y Configurar
```bash
git clone https://github.com/saulitoescobar/flowphone.git
cd flowphone
npm install
cd backend && npm install && cd ..
```

### 2. Ejecutar en Modo Desarrollo
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend  
npm start
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3002/api

## 🏗️ Arquitectura del Sistema

### Frontend Structure
```
src/
├── components/          # Componentes reutilizables
│   ├── DataTable.js    # Tabla principal con búsqueda
│   ├── Modal.js        # Modal para formularios
│   ├── Toast.js        # Notificaciones
│   ├── EmpresaSelector.js  # Selector de empresas
│   ├── UsuarioSelector.js  # Selector de usuarios
│   └── PlanSelector.js     # Selector de planes
├── pages/              # Páginas principales
│   ├── UsuariosPage.js
│   ├── EmpresasPage.js
│   ├── LineasPage.js
│   ├── PlanesPage.js
│   └── ProveedoresPage.js
└── services/           # APIs
    └── ApiService.js   # Cliente HTTP
```

### Backend Structure
```
backend/
├── models/             # Modelos de datos
├── controllers/        # Lógica de negocio
├── routes/            # Endpoints REST
├── config/            # Configuración DB
└── server.js          # Servidor principal
```

## 🔧 Configuraciones Importantes

### API Base URL
**Archivo:** `src/services/ApiService.js`
```javascript
const API_BASE_URL = 'http://localhost:3002/api';
```

### Backend Ports
**Archivo:** `backend/server.js`
```javascript
const PORT = process.env.PORT || 3002;
```

### CORS Configuration
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

## 📊 Entidades y Campos

### Usuarios
- `id`, `nombre`, `email`, `telefono`, `empresa`, `empresa_id`

### Empresas  
- `id`, `nombre`, `direccion`, `telefono`, `nit`

### Líneas
- `id`, `numero`, `estado`, `fecha_activacion`, `usuario_id`, `empresa_id`, `plan_id`

### Planes
- `id`, `nombre`, `descripcion`, `precio`

### Proveedores
- `id`, `nombre`, `contacto`, `telefono`

## 🔄 API Endpoints

### Pattern CRUD Completo
```
GET    /api/{entity}      # Listar todos
POST   /api/{entity}      # Crear nuevo
PUT    /api/{entity}/:id  # Actualizar
DELETE /api/{entity}/:id  # Eliminar
```

### Entities: usuarios, empresas, lineas, planes, proveedores

## 🧪 Modo Mock Actual

### Data Storage (server.js)
```javascript
let mockUsuarios = [...];
let mockEmpresas = [...];
let mockPlanes = [...];
let mockProveedores = [...];
let mockLineas = [...];
```

### Testing APIs
```bash
# PowerShell testing
Invoke-RestMethod -Uri "http://localhost:3002/api/usuarios" -Method Get

# POST example
$body = @{nombre="Test"; email="test@test.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3002/api/usuarios" -Method Post -Body $body -ContentType "application/json"
```

## 🎨 UI Components Guide

### DataTable Props
```javascript
<DataTable
  title="Título"
  data={array}
  columns={[{key: 'field', label: 'Label'}]}
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
```

### Modal Pattern
```javascript
const [isAdding, setIsAdding] = useState(false);
const [formData, setFormData] = useState({});

<Modal
  isOpen={isAdding}
  onClose={() => setIsAdding(false)}
  title="Agregar Item"
>
  {/* Form content */}
</Modal>
```

### Toast Notifications
```javascript
const { showToast, ToastComponent } = useToast();

// Usage
showToast('Mensaje', 'success|error|info');

// In JSX
{ToastComponent}
```

## 🐛 Common Issues & Solutions

### Vista No Se Actualiza
**Solución:** Usar nuevas referencias de arrays
```javascript
setUsuarios([...data]); // ✅ Correcto
setUsuarios(data);      // ❌ No re-renderiza
```

### API Connection Errors
**Check:**
1. Backend running on port 3002
2. CORS configured correctly
3. API_BASE_URL matches backend port

### Search Not Working
**Verificar normalización:**
```javascript
const normalizeText = (text) => {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};
```

## 🔮 Migration to Production

### Database Setup
1. Configure MySQL connection in `backend/config/database.js`
2. Run migration scripts in `backend/scripts/`
3. Comment out mock routes in `server.js`
4. Uncomment real routes in `server.js`

### Environment Variables
```bash
# .env
DATABASE_HOST=localhost
DATABASE_USER=root  
DATABASE_PASSWORD=password
DATABASE_NAME=lineas_db
PORT=3002
```

## 📝 Development Workflow

### Adding New Features
1. Create/modify components in `src/components/`
2. Update pages in `src/pages/`
3. Add API endpoints in `backend/routes/`
4. Test with mock data first
5. Add to real database later

### Git Workflow
```bash
git add .
git commit -m "Description"
git push origin main
```

## 🔍 Debugging Tips

### Frontend Debug
- Chrome DevTools → Console for React logs
- Network tab for API calls
- React DevTools extension

### Backend Debug  
- Terminal logs for API requests
- Add `console.log()` in controllers
- Test endpoints with PowerShell/Postman

### State Management Debug
```javascript
useEffect(() => {
  console.log('State updated:', state);
}, [state]);
```
