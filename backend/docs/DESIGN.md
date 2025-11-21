# BACKEND
## Documento de Dieseño - FlowUp API
_Este documento detalla los pasos y el diseño arquitectonico base de la construcción del backend (*API REST*), basado en los Principios de Modularidad
y Separacion de Responsabilidades.

### 1.Principio Centra: Separación de Responsabilidades
La aplicación está diseñada para evitar que un módulo solo asuma múltiples tareas de configuración,
orquestación y servicio. Facilita el mantenimiento y escalabilidad.

#### Estructura de Módulos (Flujo de control)

`app.js` `&rarr` *Configurador:* Definición de Express, Middlewares y Rutas.
`server.js` `&rarr` *Orquestador:* Carga de entorno (dotenv), gestión de la BBDD y arranque servidor. 
`database.js` `&rarr` *Servicio:* Lógica para establecer la coneción con MongoDB.

### 2.Arranque asíncrono en `server.js`
El servidor *NO debe comenzar a escuchar peticiones* hasta que la base de datos esté disponible.

#### Flujo de ejecución
1.  Se carga el entorno `dotenv.config()`.
2.  Se llama a la función startServer (async).
3.  await `connectDB()`: se pausa el flujo hasta que la conexión es OK.
4.  Solo si la conexión es OK, se llama a `app.listen(PORT, HOST, ...)` para que el servidor EXPRESS
comience a aceptar peticiones.

### 3.Arquitectura app.js
El archivo `app.js` simplemente cumple los siguientes puntos:
*   Instancia Unica: inicializa `const app = express()` y la exporta.
*   Sincronía: el código se mantiene sincrono. No contiene llamadas asíncronas(await) ni llamadas
de arranque.
*   Middlewares: Incluye `cors()` para el manejo de peticiones cross-origin y `express.json()`
para el analisis del cuerpo de las peticiones JSON.
