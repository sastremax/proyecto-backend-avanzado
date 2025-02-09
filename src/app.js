import express from 'express';  // importo express
import productsRouter from './routes/products.js';   // importo el router del producto
import cartsRouter from './routes/carts.js';   // importo el router del carrito
import path from 'path';  // importo path para trabajar con las rutas de los directorios
import { fileURLToPath } from 'url';  // importo fileURLToPath para manejar __dirname con ESM
import logger from './middlewares/logger.js';   // Importo el middleware
import errorHandler from './middlewares/errorHandler.js';   // Importo el middleware de manejo de errores

// hay que inicializar
const app = express(); // a partir de aqui app tendra todas las funcionalidades de express

const PORT = 8080;  // puerto 8080

const __filename = fileURLToPath(import.meta.url);  // es para obtener la ruta del archivoa actual
const __dirname = path.dirname(__filename);  // para obetener el directorio del archivo

app.use(express.static(path.join(__dirname, 'public')));  // para acceder a los archivo estaticos de public

// middleware para analizar datos en formato JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware a nivel de aplicación
app.use(logger);

// configuración de las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    console.log(`Ruta no encontrada: ${req.method} ${req.url}`);  // Muestra en la terminal
    res.status(404).json({
        success: false,
        message: "Not Found"
    });
});

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);  // mensaje de escucha del puerto
});