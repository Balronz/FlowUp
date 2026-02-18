# Taskly - Sistema de Gestión de Tareas (MERN Stack)

**Taskly** es una aplicación Full Stack diseñada para la gestión eficiente de tareas, inspirada en flujos de trabajo profesionales como Microsoft Teams. El proyecto implementa una arquitectura desacoplada con un enfoque API-First.

## Estructura del Proyecto
El repositorio se divide en tres bloques principales:
- **/backend**: API REST construida con Node.js, Express y MongoDB.
- **/frontend**: SPA (Single Page Application) desarrollada con React y Tailwind CSS.
- **/database_seed**: Colecciones en formato JSON para la replicación del entorno de datos.

## Stack Tecnológico
- **Frontend:** React 18, Tailwind CSS, Axios.
- **Backend:** Node.js, Express, Mongoose.
- **Base de Datos:** MongoDB (NoSQL).
- **Seguridad:** JWT (JSON Web Tokens) y Bcrypt para hashing de credenciales.

## Configuración de la Base de Datos
Para que la aplicación funcione con datos de prueba:
1. Abre **MongoDB Compass** y conéctate a tu instancia local.
2. Crea una base de datos llamada `flowup_db`.
3. Importa los archivos `.json` ubicados en la carpeta `/database_seed` en sus respectivas colecciones (`users` y `tasks`).

---

## Instalación y Ejecución

### Backend
1. Entra en la carpeta: `cd backend`
2. Instala dependencias: `npm install`
3. Configura el archivo `.env` (ver sección en /backend).
4. Inicia el servidor: `npm run dev` (o `node index.js`).

### Frontend
1. Entra en la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Inicia la aplicación: `npm run dev`