# BACKEND
## Documento de Dieseño - FlowUp API
Este documento detalla los pasos y el diseño arquitectonico base de la construcción del backend (*API REST*), basado en los Principios de Modularidad
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

### 4.Implementación del Módulo Tareas (CRUD)
El módulo `tasks` implementa la arquitectura de tres capas(Model, Service y Controller) para asegurar el aislamiento y reutilización.

El flujo en el módulo `tasks` es el siguiente:
1. *Controller* -> *Service* Se envían los datos `taskData`, `userId`, `taskId`.
2. *Service* -> *Controller* Devuelve documentos Mongoose o lanza el Error.

Capas de Modelo
*Responsabilidad*: Define el esquema y validaciones de datos de la BBDD.
*Seguridad*: Incluye el campo `user`(id de usuario referenciado) para asegurar que este vinculada al usuario.

Capar de Servicio
Contiene la lógica de negocio y de BBDD.
Solo recibe y devuelve objetos de datos JS o documentos Mongoose.
*Seguridad*: Todas las operaciones del CRUD se filtran con `{user: userId}` para controlar que solo se puedan acceder a las tareas propias o asignadas.
*Manejo de errores*: Se ha creado la funcion `createServiceError` para lanzar un objeto Error y manerar los posibles errores de las funciones del CRUD.

Capa de Controlador:
Punto de entrada HTTP. 
Extrae datos de `req.body` y `req.params`.
Hace llamada a las funciones del servicio.
*Respuesta HTTP*: Se captura/devuelve el resultado o se lanza un Error correspondiente a cada función del CRUD que se ha realizado.

### 5.Implementación del Módulo de Autenticación (User)
El módulo `user` implementa la arquitectura de tres capas(Model, Service y Controller) para asegurar el aislamiento y reutilización.

El flujo en el módulo `user` es el siguiente:
1. *Contorller* -> *Service*: Se envian los datos `userData`, `email` y `password`.
2. *Service* -> *Controller*: Devuelve los datos de JWT Token o lanza un error según la situacion.

Capa de Modelo
*Seguridad y validación*: Define el esquema del usuario (`email`, `password`, `userName`).
*Lógica de password*: Se usa Mongoose Pre-Hooks para hashear el password con Bcrypt antes de guardar el documento.
*Métodos de instancia*: se implementan métodos para generar el Token usando el Id del usuario `getSignedJwtToken()` y comparar el password con el hasheado
`isMatched`.

Capa de Servicio
Solo se encarga de la creación, validación de credenciales y generacion de token.
*Registro*: se crea el usuario y se devuelve el token a raiz de su Id `registerUser`.
*Login*: Busca el email y verificando tanto el email como la password devuelve el token si existe `loginUser`.
*Manejo de errores*: se aplica el manejo de errores según el metodo que se esté usando devolviendo un código de error especifico para cada uno.

Capa de Controlador
Recibe `req` y `res` para comunicarse con Service.
*Validación*: Verifica (que email y password no esten vacios) y los valida.
*Helper*: usa una función Helper `sendTokenResponse`. En la que se adjunta el token a una cookie como capa de seguridad. Añadiendo al token una expiración
de 1 día. Envía una respuesta 200 Ok al cliente.

### 6.Middleware de Autenticación y Protección de Rutas
Se ha implementado el middleware `authMiddleware` para poder hacer privadas ciertas rutas, en las que es necesario hacer
uso del sistema de register y login.
*Flujo de protección*:
1. El middleware obtiene el JWT de las cookies.
2. Se verifica y decodifica el token para obtener el ID.
3. Se busca el usuario con ese ID y se adjunta en `req.user`
4. En caso de que el token no sea válido o no exisitera el usuario, nos devuelve un error de no autorizado.

### 7.Capa de validacion y manero de errores de entrada
Se añade una capa mas de seguridad usando `express-validator` un middleware para garantizar la integridad de los datos de entrada en *req.body*.
*Arquitectura de validacion*: tanto para `auth` como para `tasks` se crean arrays donde se definen reglas (`check()`) para los campos definiendo atributos obligarios, opcionales, longitudes...
A traves del middleware y de su función que exportamos `validate`, se leen los errores internos de `express-validator`, si existen se genera el error y se pasa a la cadena de Express.
*Integracion de rutas*: las validaciones se insertan como middleware justo antes del controlador siguiendo un orden estricto. En Auth aplicamos las validaciones a las rutas `/register, /login, /update`. Mientras que en Tasks las aplicamos a `/post /patch`.