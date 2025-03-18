import express from 'express';  // importo express
import productsRouter from './routes/products.js';   // importo el router del producto
import cartsRouter from './routes/carts.js';   // importo el router del carrito
import path from 'path';  // importo path para trabajar con las rutas de los directorios
import logger from './middlewares/logger.js';   // Importo el middleware
import errorHandler from './middlewares/errorHandler.js';   // Importo el middleware de manejo de errores
import __dirname from './utils.js';    // Importo __dirname desde utils.js
import { engine } from 'express-handlebars'; // importo el motor de plantillas handlebarsa
// import fs from 'fs';  // importo fs para leer archivos
import http from 'http';  // para crear el servidor HTTP
import { Server as SocketIOServer } from 'socket.io'; // para la conexion de WEBSOCKET
import connectDB from './config/database.js';  // conexion a MongoDB
import productController from './controllers/products.controller.js';
import Cart from './models/Cart.model.js';  // importo el modelo de carritos

// hay que inicializar
const app = express(); // a partir de aqui app tendra todas las funcionalidades de express

const server = http.createServer(app);   // creo el servidor http con express
const io = new SocketIOServer(server);  // creo la conexion de socket.io con el servidor http

const PORT = 8080;  // puerto 8080

// conexion a MongoDB
connectDB();  

// Configuración de Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Permite acceder a propiedades del prototipo
        allowProtoMethodsByDefault: true // (Opcional) Permite acceder a métodos del prototipo
    },
    helpers: {
        eq: (a, b) => a === b,  // Compara dos valores
        multiply: (a, b) => a * b,  // Multiplica el precio por la cantidad
        calculateTotal: (products) => {
            return products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        }
    }
}));

app.set('views', path.join(__dirname, 'views'));  // para que express sepa donde estan las vistas
app.set('view engine', 'handlebars');  // handlebar se la establece como un motor de plantillas

// para acceder a los archivo estaticos de public e img
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.resolve(__dirname, 'public', 'img')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));

// middleware para analizar datos en formato JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para obtener un carrito por defecto si no existe
app.use(async (req, res, next) => {
    try {
        let cart = await Cart.findOne(); // Busco cualquier carrito en la BD

        // Si no existe un carrito, creo uno vacío
        if (!cart) {
            cart = new Cart({ products: [] });
            await cart.save();
        }

        res.locals.cartId = cart._id.toString(); // Hago el ID accesible en Handlebars
        next();
    } catch (error) {
        console.error("Error setting cartId:", error);
        next();
    }
});

// Middleware a nivel de aplicación
app.use(logger);

// configuracion de websockets con socket.io
io.on('connection', (socket) => {
    console.log('A user connected');   // confirmo que un usuario se ha conectado

    // escucho el evento 'addProduct' y emitimos el nuevo producto a todos los clientes
    socket.on('addProduct', (product) => {
        const { title, price, description, stock, category } = product; // sin imagen
        const newProduct = { title, price, description, stock, category };
        console.log('Emitiendo producto:', newProduct);
        io.emit('newProduct', newProduct);  // solo notifico el nuevo producto sin la imagen      
    });

    // escucho el evento 'deleteProduct' y emitimos la eliminacion del producto a todos los clientes
    socket.on('deleteProduct', (productId) => {
        io.emit('deleteProduct', productId);  // aqui emitimos la eliminacion del producto a todos los clientes
    });

    // descnoectamos
    socket.on('disconnect', () => {
        console.log('A user disconnected');   // cuando un usuario se desconecta
    });
});

// configuración de las rutas para la API y vistas
app.get('/', productController.getHomeView);

app.use('/api/products', productsRouter);    // API en JSON para productos
app.use('/api/carts', cartsRouter);  // API en JSON para carritos

// configuración de las vistas de handlebars
app.use('/products', productsRouter);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.url}`);  // Muestra en la terminal
    res.status(404).render(
        'notFound', { layout: "main" });
});

// Middleware de manejo de errores
app.use(errorHandler);

//  inicio el servidor
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);  // mensaje de escucha del puerto
});