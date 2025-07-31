# Instrucciones para configurar MySQL con XAMPP

## Método 1: Usar phpMyAdmin (RECOMENDADO)
1. Abre XAMPP Control Panel
2. Inicia Apache y MySQL
3. Haz clic en "Admin" junto a MySQL (se abre phpMyAdmin)
4. Ve a http://localhost/phpmyadmin
5. Copia y pega el contenido de `sql/manual_setup.sql`
6. Ejecuta el script

## Método 2: Configurar contraseña para root
1. Abre phpMyAdmin
2. Ve a la pestaña "Cuentas de usuario"
3. Edita el usuario "root"
4. Establece una contraseña (por ejemplo: "root123")
5. Actualiza tu archivo .env:
   DB_PASSWORD=root123

## Método 3: Crear un nuevo usuario MySQL
1. En phpMyAdmin, ve a "Cuentas de usuario"
2. Haz clic en "Agregar cuenta de usuario"
3. Usuario: phoneflow_user
4. Contraseña: phoneflow123
5. Selecciona "Crear base de datos con el mismo nombre"
6. Otorga todos los privilegios
7. Actualiza tu .env:
   DB_USER=phoneflow_user
   DB_PASSWORD=phoneflow123
   DB_NAME=phoneflow_user

## Verificar conexión después de configurar:
node scripts/testConnection.js
