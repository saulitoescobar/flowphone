# 📱 FlowPhone - Sistema de Gestión de Líneas Telefónicas

Un sistema web completo para gestionar líneas telefónicas empresariales con interfaz moderna y API REST.

## ✨ Características

- 🎯 **5 Entidades**: Usuarios, Empresas, Líneas, Planes, Proveedores
- 🎨 **Interfaz Moderna**: React 18 + Tailwind CSS + Framer Motion
- 🚀 **API REST**: Node.js + Express con datos mock
- 📱 **Responsive**: Funciona en desktop y móvil
- 🔍 **Búsqueda Avanzada**: Búsqueda en tiempo real con normalización
- ✅ **CRUD Completo**: Crear, leer, actualizar, eliminar

## 🚀 Inicio Rápido

### Opción 1: Configuración Automática (Recomendada)
```bash
# Windows PowerShell
./setup.ps1

# O comando directo
npm run setup
```

### Opción 2: Configuración Manual
```bash
# 1. Instalar dependencias
npm install
cd backend && npm install && cd ..

# 2. Iniciar todo junto
npm run dev

# O por separado:
npm run backend  # Solo backend (puerto 3002)
npm start        # Solo frontend (puerto 3000)
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3002  
- **API**: http://localhost:3002/api

## 📁 Estructura Simplificada

```
flowphone/
├── src/                 # Frontend React
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   └── services/       # Servicios API
├── backend/            # Backend Node.js
│   ├── server.js       # Servidor principal (con mock data)
│   ├── routes/         # Rutas API (para DB real)
│   └── models/         # Modelos de datos
├── public/             # Archivos estáticos
├── .env               # Variables de entorno
└── package.json       # Scripts simplificados
```

## 🎯 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run setup` | Instala todo y inicia el proyecto |
| `npm run dev` | Inicia frontend + backend |
| `npm start` | Solo frontend |
| `npm run backend` | Solo backend |
| `npm run build` | Build para producción |

## 🔧 Configuración

El archivo `.env` contiene toda la configuración:
- Puertos del frontend (3000) y backend (3002)
- URL de la API
- Configuración de base de datos (opcional)

## 📊 Estado del Proyecto

✅ **Completamente Funcional**
- Interfaz de usuario completa
- CRUD para todas las entidades  
- API REST funcionando
- Datos mock con persistencia
- Búsqueda y filtros
- Diseño responsive

## 🎨 Tecnologías

**Frontend**
- React 18
- Tailwind CSS
- Framer Motion
- Lucide React (iconos)
- React Router

**Backend**  
- Node.js
- Express
- CORS
- Datos mock en memoria

## 📝 Uso

1. Ejecuta `npm run dev`
2. Abre http://localhost:3000
3. Navega entre las secciones: Usuarios, Empresas, Líneas, Planes, Proveedores
4. Usa los botones para agregar, editar o eliminar registros
5. Utiliza la búsqueda para filtrar resultados

## 🔄 Próximos Pasos

- [ ] Conectar base de datos MySQL real
- [ ] Sistema de autenticación
- [ ] Dashboard con gráficos
- [ ] Reportes y exportación
- [ ] Tests unitarios
