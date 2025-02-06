import express from 'express';

const router = express.Router();

// array de carritos en memoria
let carts = [
    { id: 1, products: [{ productId: 1, quantity: 1 }] },
    { id: 2, products: [{ productId: 2, quantity: 1 }] }
];

//  creo un carrito
router.post('/', (req, res) => {
    const newCart = { id: carts.length + 1, products: [] };  // creo un nuevo carrito quie esta vacio
    carts.push(newCart);      // agrega un nuevo carrito al array de los carritos
    res.status(201).json(newCart);   // da un resultado 201
});

// obtengo un carrito por ID
router.get('/:cid', (req, res) => {
    try {
        const cart = carts.find(c => c.id == req.params.cid);  // busco el carrito por ID

        if (!cart) {      // si no lo encuentro 
            return res.status(404).send('Cart not found'); // da u resultado 404
        }

        res.json(cart);  // si lo encuentro devuelvo el carrito en formato JSON

    } catch (error) {
        return res.status(500).send('Error reading carts');  //da un resultado 500
    }
});

//  agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(c => c.id == req.params.cid);  // busco el carrito por ID
    if (!cart) {                                      // si no lo encuentro
        return res.status(404).send('cart not found');  // da un resultado 404
    }

    const { quantity } = req.body;  // obtengo la cantidad
    if (quantity <= 0) {                             // si cantidad es menor o igual a 0
        return res.status(400).send('Invalid quantity');  // da un resultado 400
    }

    const productIndex = cart.products.findIndex(
        p => p.product == req.params.pid
    );  // busco si el producto esta en el carrito

    if (productIndex === -1) {  // si el producto no esta en el carrito
        cart.products.push({ productId: req.params.pid, quantity: quantity });  // lo agrego con la cantidad introducida
    } else {     // si el producto ya esta en el carrito 
        cart.products[productIndex].quantity += quantity;  // actualizo la cantidad
    }

    res.json(cart.products);  //resultado: productos actualizados en el carrito
});

// eliminar un producto de un carrito
router.delete('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(c => c.id == req.params.cid);   // busco el carrito por ID
    if (!cart) {                                             // si no lo encuentro
        return res.status(404).send('Cart not found');     // da un resultado 404
    }
    // si lo encuentro
    const productIndex = cart.products.findIndex(p => p.productId == req.params.pid);  // busco el porducto por ID
    if (productIndex === -1) {                // si el producto no esta en el carrito
        res.status(204).send();              // da un resultado 204
    }
    // si esta
    cart.products.splice(productIndex, 1)     // elimino el producto del carrito
    res.status(204).send();                    // da una repsuesta 204
});

// eliminar un carrito
router.delete('/:cid', (req, res) => {
    const cartIndex = carts.findIndex(c => c.id == req.params.cid);  // busco el carrtio por ID

    if (cartIndex === -1) {                     // si no encuentro el carrito
        return res.status(404).send('Cart not found');    // da un resultado 404
    }
    // si lo encuentro
    cart.splice(cartIndex, 1);     // elimino el carrito
    res.status(204).send();          // da un resultado 204
});

export default router;  // exporto el router para que se pueda usar en el archivo principal