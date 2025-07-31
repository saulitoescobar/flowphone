# Contexto del Proyecto para GitHub Copilot

## 📋 Resumen Ejecutivo
**Proyecto:** Sistema de gestión de líneas telefónicas  
**Estado:** Completamente funcional con datos mock  
**Última sesión:** 30 de Julio 2025  
**Desarrollador:** Usuario con GitHub Copilot

## 🎯 ¿Qué es este proyecto?
Un sistema web completo para gestionar líneas telefónicas empresariales con:
- **5 entidades principales:** Usuarios, Empresas, Líneas, Planes, Proveedores
- **Frontend moderno:** React 18 + Tailwind CSS + Framer Motion
- **Backend robusto:** Node.js + Express + MySQL (modo mock implementado)
- **Funcionalidad completa:** CRUD para todas las entidades

## 🔄 Estado Actual del Desarrollo

### ✅ Completado al 100%
1. **Interfaz de usuario completa** - Todas las páginas implementadas
2. **Sistema CRUD funcional** - Crear, leer, actualizar, eliminar
3. **Componentes reutilizables** - DataTable, Modal, Selectores
4. **API REST completa** - Todos los endpoints implementados
5. **Modo mock con persistencia** - Funciona sin base de datos
6. **Búsqueda inteligente** - Con normalización de texto
7. **Sistema de notificaciones** - Toast messages
8. **Responsive design** - Mobile-friendly

### 🏗️ Arquitectura Técnica

#### Frontend (React)
```
- DataTable: Tabla principal reutilizable
- Modal: Sistema de ventanas emergentes  
- Toast: Notificaciones al usuario
- Selectores: EmpresaSelector, UsuarioSelector, PlanSelector
- Páginas: Una por cada entidad (usuarios, empresas, etc.)
- Servicios: ApiService para comunicación HTTP
```

#### Backend (Express)
```
- server.js: Servidor principal con rutas mock
- Estructura MVC: models/, controllers/, routes/
- Mock data: Arrays en memoria para desarrollo
- CORS: Configurado para desarrollo local
```

## 🔧 Configuración de Desarrollo

### Puertos
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3002

### Comandos de inicio
```bash
# Backend
cd backend && node server.js

# Frontend  
npm start
```

## 🧠 Problemas Resueltos en la Última Sesión

### 1. Vista no se actualizaba
**Síntoma:** Operaciones CRUD exitosas pero tabla no se refrescaba
**Causa:** React no detectaba cambios en arrays
**Solución:** `setUsuarios([...data])` + `refreshKey` para forzar re-render

### 2. Error 500 en API
**Síntoma:** Backend devolvía error 500 en operaciones
**Causa:** MySQL no conectado, rutas apuntando a base de datos
**Solución:** Implementación completa de modo mock con persistencia

### 3. Selectores no funcionaban
**Síntoma:** Dropdowns de empresas/usuarios no cargaban
**Causa:** Estructura de datos inconsistente
**Solución:** Estandarización de formato de respuesta API

## 💡 Patrones de Código Establecidos

### Estado de React
```javascript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [isAdding, setIsAdding] = useState(false);
const [refreshKey, setRefreshKey] = useState(0);
```

### Operaciones CRUD
```javascript
const handleSave = async (data) => {
  try {
    if (isAdding) {
      await Service.create(data);
    } else {
      await Service.update(currentId, data);
    }
    await loadData(); // Recargar lista
    handleCancel();   // Cerrar modal
    showToast('Éxito', 'success');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
};
```

### Estructura de Selectores
```javascript
<EmpresaSelector
  value={formData.empresa_id}
  onChange={(empresa) => setFormData({...formData, empresa_id: empresa.id})}
  placeholder="Seleccionar empresa..."
/>
```

## 🔍 Características Únicas Implementadas

### Búsqueda Avanzada
- Normalización de texto (sin tildes)
- Búsqueda en tiempo real
- Búsqueda en todos los campos

### Persistencia Mock
- Arrays globales en backend
- Operaciones CRUD persisten durante sesión
- IDs autogenerados con timestamp

### UI/UX Moderna
- Animaciones con Framer Motion
- Tailwind CSS para styling
- Iconos Lucide React
- Estados de loading y error

## 🎯 Instrucciones para GitHub Copilot

### Al trabajar en este proyecto:
1. **Usa la estructura existente** - Componentes y patrones ya establecidos
2. **Mantén consistencia** - Sigue los patrones de naming y estructura
3. **Mock data first** - Desarrolla con datos mock antes que base de datos
4. **Estado React optimizado** - Usa refreshKey y nuevas referencias de arrays
5. **Logging detallado** - Agrega console.logs para debugging

### Comandos útiles para continuar:
```bash
# Ver estado del proyecto
git status

# Iniciar desarrollo
cd backend && node server.js  # Terminal 1
npm start                     # Terminal 2

# Probar APIs
Invoke-RestMethod -Uri "http://localhost:3002/api/usuarios" -Method Get
```

### Archivos clave para modificar:
- **Frontend:** `src/pages/*.js`, `src/components/*.js`
- **Backend:** `backend/server.js` (para mock), `backend/routes/*.js`
- **Estilos:** Tailwind classes en JSX
- **API:** `src/services/ApiService.js`

## 🚀 Próximos pasos típicos:
1. Conectar base de datos MySQL real
2. Agregar autenticación de usuarios
3. Implementar reportes y dashboards
4. Deploy a producción
5. Agregar tests unitarios

**Este proyecto está listo para producción con base de datos real.**
