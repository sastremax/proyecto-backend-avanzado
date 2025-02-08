import express from 'express';
import CartManager from '../managers/CartManager.js';

// creo una instancia del router
const router = express.Router();

// creo una instancia de CartManager
const cartManager = new CartManager();

//  creo un carrito nuevo
router.post('/', (req, res) => {
    const newCart = cartManager.createCart();  // creo un nuevo carrito quie esta vacio    
    res.status(201).json(newCart);   // da un resultado 201
});

// obtengo un carrito por ID
router.get('/:cid', (req, res) => {
    try {
        const cart = cartManager.getCartById(req.params.cid);  // busco el carrito por ID

        if (!cart) {      // si no lo encuentro 
            return res.status(404).send('Cart not found'); // da u resultado 404
        }
        res.json(cart);  // si lo encuentro devuelvo el carrito en formato JSON

    } catch (error) {
        return res.status(500).send('Error reading carts');  // en caso de error da un resultado 500
    }
});

//  agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { quantity } = req.body;  // obtengo la cantidad
    if (!quantity || quantity <= 0) {       // si cantidad es menor o igual a 0
        return res.status(400).send('Invalid quantity');  // da un resultado 400
    }

    const updatedCart = cartManager.addProductToCart(req.params.cid, req.params.pid, quantity); // agrego el producto al carrito
    if (!updatedCart) {
        return res.status(404).send('cart or product not found'); // si el carrito o producto no existe da un resultado de 404
    }
    res.json(updatedCart); // envio el carrito actualizado
});

// eliminar un producto de un carrito
router.delete('/:cid/product/:pid', (req, res) => {
    const updatedCart = cartManager.removeProductFromCart(req.params.cid, req.params.pid); // llamo a la funcion para eliminar el producto del carrito

    if (!updatecart) {                                             // si no lo encuentro
        return res.status(404).send('Cart not found');     // da un resultado 404
    }
    // si lo encuentro
    res.json(updatedCart); // envio el carrito actualizado
});

// eliminar un carrito
router.delete('/:cid', (req, res) => {
    const deleted = cartManager.deleteCart(req.params.cid); // llamo a la funcion que elimina el carrito

    if (!deleted) {                     // si no encuentro el carrito
        return res.status(404).send('Cart not found');    // da un resultado 404
    }
    // si lo encuentro    
    res.status(204).send();          // da un resultado 204
});

export default router;  // exporto el router para que se pueda usar en el archivo principal