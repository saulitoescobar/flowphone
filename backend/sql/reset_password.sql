-- Comandos para resetear contraseña de MySQL

-- OPCIÓN 1: Si puedes conectarte sin contraseña
-- Ejecuta estos comandos en MySQL Workbench:

-- Para MySQL 8.0 o superior:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'phoneflow123';
FLUSH PRIVILEGES;

-- Para MySQL 5.7 o inferior:
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('phoneflow123');
FLUSH PRIVILEGES;

-- OPCIÓN 2: Crear un nuevo usuario para el proyecto
CREATE USER 'phoneflow_user'@'localhost' IDENTIFIED BY 'phoneflow123';
GRANT ALL PRIVILEGES ON *.* TO 'phoneflow_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- OPCIÓN 3: Verificar usuarios existentes
SELECT User, Host FROM mysql.user;

-- OPCIÓN 4: Eliminar contraseña (solo para desarrollo local)
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
