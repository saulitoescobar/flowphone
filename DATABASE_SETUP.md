# 🗄️ Configuración de Base de Datos MySQL

## Opción 1: Instalación Local de MySQL

### Windows
1. **Descargar MySQL**: https://dev.mysql.com/downloads/mysql/
2. **Instalar MySQL Community Server**
3. **Configurar usuario root con contraseña (opcional)**

### Verificar instalación
```bash
mysql -u root -p
```

## Opción 2: Usar XAMPP (Recomendado para desarrollo)

1. **Descargar XAMPP**: https://www.apachefriends.org/
2. **Instalar y ejecutar**
3. **Iniciar MySQL desde el panel de control**

## Opción 3: Docker (Avanzado)

```bash
docker run --name flowphone-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=flowphone_db -p 3306:3306 -d mysql:8.0
```

## Configurar Proyecto

1. **Actualizar credenciales en .env**:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=flowphone_db
DB_USER=root
DB_PASSWORD=tu_password_aqui
USE_DATABASE=true
```

2. **Ejecutar configuración**:
```bash
npm run setup-db
```

3. **Iniciar con base de datos**:
```bash
npm run dev
```

## Modo Híbrido (Actual)

El proyecto funciona automáticamente:
- ✅ **Con MySQL**: Usa datos reales de la base de datos
- ✅ **Sin MySQL**: Usa datos mock en memoria

Para cambiar entre modos, edita `USE_DATABASE` en `.env`
