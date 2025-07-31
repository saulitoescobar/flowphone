# Sistema de Gestión de Líneas Telefónicas

Una aplicación web completa para la gestión de líneas telefónicas, usuarios, empresas, planes y proveedores.

## 🚀 Características

- **Frontend**: React 18 con Tailwind CSS y Framer Motion
- **Backend**: Node.js con Express
- **Base de datos**: MySQL (con modo mock para desarrollo)
- **Interfaz moderna**: Componentes reutilizables y animaciones fluidas
- **CRUD completo**: Crear, leer, actualizar y eliminar para todas las entidades

## 📋 Entidades del Sistema

1. **Usuarios** - Gestión de usuarios del sistema
2. **Empresas** - Administración de empresas clientes
3. **Líneas** - Control de líneas telefónicas
4. **Planes** - Gestión de planes de servicio
5. **Proveedores** - Administración de proveedores de servicios

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Lucide Icons
- React Hooks

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- JSON parsing

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (opcional, funciona con datos mock)
- Git

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd lineas
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

4. **Configurar la base de datos (opcional)**
   - Crear una base de datos MySQL
   - Configurar las credenciales en `backend/config/database.js`
   - Ejecutar los scripts de migración en `backend/scripts/`

## 🚀 Ejecución

### Modo Desarrollo

1. **Iniciar el backend** (en una terminal)
   ```bash
   cd backend
   node server.js
   ```
   El backend estará disponible en `http://localhost:3002`

2. **Iniciar el frontend** (en otra terminal)
   ```bash
   npm start
   ```
   El frontend estará disponible en `http://localhost:3000`

### Modo Producción

```bash
npm run build
```

## 🔧 Configuración

### Backend
- Puerto por defecto: `3002`
- Base de datos: MySQL (configurar en `backend/config/database.js`)
- Modo mock: Activado por defecto si MySQL no está disponible

### Frontend
- Puerto por defecto: `3000`
- API Base URL: `http://localhost:3002/api`

## 📁 Estructura del Proyecto

```
lineas/
├── backend/                 # Servidor Node.js
│   ├── config/             # Configuración de BD
│   ├── controllers/        # Controladores de API
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas de API
│   ├── scripts/            # Scripts de migración
│   └── server.js           # Servidor principal
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la aplicación
│   ├── services/           # Servicios de API
│   └── App.js              # Componente principal
└── public/                 # Archivos estáticos
```

## 🎯 Funcionalidades

### Gestión de Usuarios
- ✅ Listar usuarios con paginación y búsqueda
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Selector de empresas con búsqueda

### Gestión de Empresas
- ✅ CRUD completo de empresas
- ✅ Campo NIT obligatorio
- ✅ Validación de datos

### Gestión de Líneas
- ✅ Control de líneas telefónicas
- ✅ Asignación de usuarios, empresas y planes
- ✅ Estado de líneas (activa/inactiva)

### Gestión de Planes y Proveedores
- ✅ Administración completa
- ✅ Integración con otras entidades

## 🔄 API Endpoints

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Empresas
- `GET /api/empresas` - Listar empresas
- `POST /api/empresas` - Crear empresa
- `PUT /api/empresas/:id` - Actualizar empresa
- `DELETE /api/empresas/:id` - Eliminar empresa

*(Similar para líneas, planes y proveedores)*

## 🧪 Modo Mock

El sistema incluye un modo mock completo que permite:
- Desarrollo sin base de datos
- Persistencia de datos en memoria durante la sesión
- Todas las operaciones CRUD funcionales
- Ideal para demos y desarrollo inicial

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- Desarrollado con ❤️ para la gestión eficiente de líneas telefónicas

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
