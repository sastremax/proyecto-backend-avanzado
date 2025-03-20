import express from 'express';
import logger from '../middlewares/logger.js';
import cartController from '../controllers/carts.controller.js';

// creo una instancia del router
const router = express.Router();

// Middleware a nivel del router
router.use(logger);

// obtengo un carrito por id desde mongodb
router.get('/:id', cartController.getCartById);

// agrego una ruta para insertar carritos de prueba en la base de datos
router.post('/seed', cartController.seedCarts);

// agrego un carrito vacío en mongodb
router.post('/', cartController.createCart);

// agrego un producto al carrito desde mongodb
router.post('/:id/products/:productId', cartController.addProductToCart);

// vacio un carrito entero desde mongodb, no lo elimino
router.put('/:id', cartController.clearCart);

// actualizo un carrito reemplazando todos sus productos
router.put('/:id/products', cartController.updateCart);

// actualizo solo la cantidad de un producto dentro de un carrito
router.put('/:id/products/:productId', cartController.updateProductQuantity);

//elimino un producto de un carrito desde mongodb
router.delete('/:id/products/:productId', cartController.removeProductFromCart);

//elimino un carrito desde mongodb
router.delete('/:id', cartController.deleteCart);

export default router;  // exporto el router para que se pueda usar en el archivo principal