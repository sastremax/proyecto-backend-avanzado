E-commerce Backend - Proyecto con Node.js y Express

Descripción del Proyecto
Este proyecto es una aplicación backend de comercio electrónico desarrollada con Node.js y Express. Permite gestionar productos y carritos de compra mediante una API REST, así como visualizar productos en una interfaz con Handlebars. La persistencia de datos se realiza mediante archivos JSON usando el sistema de archivos de Node.

Requisitos
Node.js: Versión 16.x o superior
Express: Framework principal para el servidor
Handlebars: Motor de plantillas para renderizar vistas
File System: Para la persistencia de datos local
Socket.io: Para actualización en tiempo real
Multer: Para manejo de carga de archivos

Instalación y Configuración Desde Cero

1. Descargar e Instalar Node.js
Descarga e instala Node.js desde la página oficial de Node.js.
Verifica la instalación ejecutando el siguiente comando en la terminal:
node -v

2. Clonar el Proyecto
Ubicate en la carpeta donde quieras clonar el proyecto y ejecutá:
git clone https://github.com/tuusuario/proyecto-backend-avanzado.git

3. Instalar Dependencias:
npm install express express-handlebars mongoose mongoose-paginate-v2 multer socket.io dotenv
Ingresá a la carpeta del proyecto:
cd proyecto-backend-avanzado
Instalá las dependencias necesarias:
npm install

Uso del Proyecto

1. Ejecutar el Proyecto en Local
Para correr el servidor en modo desarrollo con nodemon:
npm run dev
Esto levantará el servidor en http://localhost:8080

2. Visualizar Productos en Vistas
El proyecto incluye una vista de productos accesible en:
http://localhost:8080/products

También incluye una vista dinámica en tiempo real para ver productos en:
http://localhost:8080/realtimeproducts

3. Uso de la API REST

Obtener todos los productos:
GET /api/products

Obtener un producto por ID:
GET /api/products/:id

Crear un producto:
POST /api/products

Actualizar un producto:
PUT /api/products/:id

Eliminar un producto:
DELETE /api/products/:id

Subir imagen de producto:
POST /api/products/:id/upload
(Usar campo image en FormData)

Agregar productos de prueba:
POST /api/products/api/seed

🔹 Carritos (ruta base: /api/carts)

Obtener un carrito por ID:
GET /api/carts/:id

Crear un carrito vacío:
POST /api/carts

Agregar carritos de prueba:
POST /api/carts/seed

Agregar un producto al carrito:
POST /api/carts/:id/products/:productId

Vaciar un carrito:
PUT /api/carts/:id

Reemplazar todos los productos de un carrito:
PUT /api/carts/:id/products

Actualizar cantidad de un producto en el carrito:
PUT /api/carts/:id/products/:productId

Eliminar un producto del carrito:
DELETE /api/carts/:id/products/:productId

Eliminar un carrito completo:
DELETE /api/carts/:id

Pruebas con Postman
Podés utilizar Postman para testear todos los endpoints mencionados. Recordá configurar correctamente el Content-Type en las solicitudes y usar el formato JSON cuando corresponda.

Carga de Archivos
El sistema permite cargar imágenes usando Multer. Se debe usar un FormData con el campo file y se guarda la ruta del archivo en el producto.

Consideraciones Finales
Este backend es una base sólida para un sistema de comercio electrónico. Incluye funcionalidades esenciales como:

- API REST para productos y carritos
- Persistencia de datos mediante archivos
- Motor de vistas con Handlebars
- Actualización en tiempo real con Socket.io
- Carga de archivos con Multer

Contacto
Autor: Maximiliano Sastre Bocalon
