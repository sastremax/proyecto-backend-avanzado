import express from 'express';
import upload from '../middlewares/multer.js';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    updateProductView,
    updateProductImage,
    deleteProduct,
    deleteProductView,
    seedProducts,
    uploadProductImage,
    getProductDetailsView,
    getHomeView
} from '../controllers/products.controller.js';

// creo una instancia del router
const router = express.Router();

// Middleware a nivel de router
router.use((req, res, next) => {
    console.log(`Log de productos: ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();   // paso al siguiente middleware
});

// Middleware de validación para productos (POST y PUT)
function validateProduct(req, res, next) {
    const { title, price, description, code, stock, category } = req.body;
    if (!title || !price || !description || !code || !stock || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
}

// Middleware de timestamp (añade fecha y hora a la solicitud)
function addTimestamp(req, res, next) {
    req.timestamp = new Date().toISOString();
    next();
}

//rutas para la API
router.get('/', getProducts); // obtener productos en formato JSON (para Postman)
router.get('/:id',getProductById);  // obtener un producto por ID desde MongoDB (para Postman)
router.post('/', addProduct);  // agregar un producto a la base de datos (para Postman)
router.put('/:id', updateProduct);  // actualizar un producto ya existente (para Postman)
router.delete('/:id', deleteProduct);  // eliminar un producto (para Postman)
router.post('/api/seed', seedProducts);  // agrego una ruta para insertar productos de prueba en la base de datos (para Postman)

// Middleware para subir imagenes
router.post('/api/products/:id/upload', upload.single('image'), uploadProductImage); // para la API

//rutas para el navegador
router.get('/', getHomeView);  // obtener todos los productos en formato JSON (para el navegador)

export default router;   // exporto el router para que se pueda usar en el archivo principal