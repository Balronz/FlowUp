# Taskly API - Documentación Técnica

Servidor robusto encargado de la lógica de negocio, persistencia de datos y seguridad.

## Arquitectura de Software
Se ha implementado un patrón de **Arquitectura en Capas**:
- **Models:** Definición de esquemas de Mongoose con Pre-Hooks para seguridad.
- **Controllers:** Lógica de orquestación de peticiones y respuestas HTTP.
- **Routes:** Definición de endpoints RESTful.
- **Middleware:** Validación de esquemas (express-validator) y protección de rutas mediante JWT.

## Variables de Entorno
Crea un archivo `.env` en la raíz de esta carpeta con los siguientes campos:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/flowup_db
JWT_SECRET=tu_clave_secreta_para_desarrollo

## Importación Manual (mongoimport)

Si prefieres usar las herramientas de línea de comandos de MongoDB, ejecuta lo siguiente desde la carpeta donde residen los JSON:

mongoimport --db flowup_db --collection users --file users.json --jsonArray
mongoimport --db flowup_db --collection tasks --file tasks.json --jsonArray
kImportación Manual (mongoimport)

Si prefieres usar las herramientas de línea de comandos de MongoDB, ejecuta lo siguiente desde la carpeta donde residen los JSON:

mongoimport --db flowup_db --collection users --file users.json --jsonArray
mongoimport --db flowup_db --collection tasks --file tasks.json --jsonArray
