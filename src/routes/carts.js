import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// para obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ruta del archivo JSON de carritos
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// funcion para leer los carritos desde el archivo json
const readCartsFromFile = () => {
    if (!fs.existsSync(cartsFilePath)) return [];   // si el archivo no existe devuelvo un array vacio
    const data = fs.readFileSync(cartsFilePath, 'utf-8');  // leo el contenido del archivo
    return JSON.parse(data);  // convierto el contenido a formato json y lo retorno
};

// funcion para escribir los carritos en el archivo JSON
const writeCartsToFile = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');  // escribo el archivo con formato json
};

//  creo un carrito nuevo
router.post('/', (req, res) => {
    const carts = readCartsFromFile();  // leo los carritos
    const newCart = { id: carts.length + 1, products: [] };  // creo un nuevo carrito quie esta vacio
    carts.push(newCart);      // agrega un nuevo carrito al array de los carritos
    writeCartsToFile(carts);  // guardo los carritos en el archivo json
    res.status(201).json(newCart);   // da un resultado 201
});

// obtengo un carrito por ID
router.get('/:cid', (req, res) => {
    try {
        const carts = readCartsFromFile();  // leo los carritos
        const cart = carts.find(c => c.id === Number(req.params.cid));  // busco el carrito por ID

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
    const carts = readCartsFromFile();   // leo los carritos
    const cart = carts.find(c => c.id == Number(req.params.cid));  // busco el carrito por ID
    if (!cart) {                                      // si no lo encuentro
        return res.status(404).send('cart not found');  // da un resultado 404
    }

    const { quantity } = req.body;  // obtengo la cantidad
    if (quantity <= 0) {                             // si cantidad es menor o igual a 0
        return res.status(400).send('Invalid quantity');  // da un resultado 400
    }

    const productIndex = cart.products.findIndex(
        p => p.productId === Number(req.params.pid
        ));  // busco si el producto esta en el carrito

    if (productIndex === -1) {  // si el producto no esta en el carrito
        cart.products.push({ productId: Number(req.params.pid), quantity: quantity });  // lo agrego con la cantidad introducida
    } else {     // si el producto ya esta en el carrito 
        cart.products[productIndex].quantity += quantity;  // actualizo la cantidad
    }

    writeCartsToFile(carts);   // guardo los carritos actualizados en el archivo json
    res.json(cart.products);  //resultado: productos actualizados en el carrito
});

// eliminar un producto de un carrito
router.delete('/:cid/product/:pid', (req, res) => {
    const carts = readCartsFromFile();  // leo los carritos
    const cart = carts.find(c => c.id === Number(req.params.cid));   // busco el carrito por ID

    if (!cart) {                                             // si no lo encuentro
        return res.status(404).send('Cart not found');     // da un resultado 404
    }
    // si lo encuentro
    const productIndex = cart.products.findIndex(p => p.productId == req.params.pid);  // busco el porducto por ID
    if (productIndex === -1) {                // si el producto no esta en el carrito
        res.status(204).send();              // da un resultado 204
    }
    // si esta
    cart.products.splice(productIndex, 1);     // elimino el producto del carrito
    writeCartsToFile(carts);                  // guardo los carritos actualizados en el archivo json
    res.status(204).send();                    // da una repsuesta 204
});

// eliminar un carrito
router.delete('/:cid', (req, res) => {
    const carts = readCartsFromFile();    // leo los carritos
    const cartIndex = carts.findIndex(c => c.id === Number(req.params.cid));  // busco el carrtio por ID

    if (cartIndex === -1) {                     // si no encuentro el carrito
        return res.status(404).send('Cart not found');    // da un resultado 404
    }
    // si lo encuentro
    carts.splice(cartIndex, 1);     // elimino el carrito
    writeCartsToFile(carts);         // guardo los carritos actualizados en el archivo json
    res.status(204).send();          // da un resultado 204
});

export default router;  // exporto el router para que se pueda usar en el archivo principal