import express from 'express';
import ProductManager from '../managers/ProductManager.js';

// creo una instancia del router
const router = express.Router();

// creo una instancia de ProductManager
const productManager = new ProductManager();

// obtengo todos los productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);  // se agrega un limite de consultas mediante un parseo a entero
    const products = productManager.getProducts(limit);  // obtengo los productos con o sin limite   
    res.json(products);  // Respondo con la lista de todos los productos en formato JSON
});

// obtengo un producto por ID
router.get('/:pid', (req, res) => {
    const product = productManager.getProductById(req.params.pid);  // Busco el producto con el ID que llega en los parámetros

    if (!product) {  //  Si no lo encuentro al producto
        res.status(404).send('Product not found');  //  el resultado sera un error
    }
    res.json(product);  // si lo encuentro devuelvo un JSON del producto
});

// agregar un producto nuevo
router.post('/', (req, res) => {
    const newProduct = productManager.addProduct(req.body);  // agrego un producto nuevo
    res.status(201).json(newProduct); //  da como resultado un 201
});

// Actualizar un producto ya existente
router.put('/:pid', (req, res) => {
    const updatedProduct = productManager.updateProduct(req.params.pid, req.body); // actualizo el producto

    if (!updatedProduct) {
        return res.status(404).send('Product not found');  // da como resultado un 404
    }
    res.json(updatedProduct); // envio el producto actualizado    
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    const deleted = productManager.deleteProduct(req.params.pid); //  elimino el prodcuto

    if (!deleted) {
        return res.status(404).send('Product not found');   // si nmo existe da como resultado un 404
    }
    res.status(204).send('No content');  // da como resultado un 204 no content
});

export default router;   // exporto el router para que se pueda usar en el archivo principal