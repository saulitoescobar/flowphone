# Instrucciones para resetear contraseña de MySQL

## Método 1: Desde MySQL Workbench
1. Si puedes conectarte:
   - Abre una nueva consulta
   - Ejecuta: ALTER USER 'root'@'localhost' IDENTIFIED BY 'phoneflow123';
   - Ejecuta: FLUSH PRIVILEGES;

## Método 2: Desde XAMPP Control Panel
1. Para MySQL en XAMPP:
   - Ve a XAMPP Control Panel
   - Para MySQL
   - Ve a Config > my.ini
   - Añade bajo [mysqld]: skip-grant-tables
   - Reinicia MySQL
   - Conecta sin contraseña y cambia la contraseña
   - Quita skip-grant-tables y reinicia

## Método 3: Desde línea de comandos (Windows)
1. Para y reinicia MySQL con opciones especiales:
   ```cmd
   net stop mysql
   mysqld --skip-grant-tables --skip-networking
   ```
   
2. En otra terminal:
   ```cmd
   mysql -u root
   ```
   
3. Ejecuta:
   ```sql
   USE mysql;
   UPDATE user SET authentication_string = PASSWORD('phoneflow123') WHERE User = 'root' AND Host = 'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

## Método 4: Crear usuario nuevo (RECOMENDADO)
En lugar de cambiar root, crear un usuario específico:
```sql
CREATE USER 'phoneflow'@'localhost' IDENTIFIED BY 'phoneflow123';
GRANT ALL PRIVILEGES ON *.* TO 'phoneflow'@'localhost';
FLUSH PRIVILEGES;
```

Luego actualizar .env:
DB_USER=phoneflow
DB_PASSWORD=phoneflow123
