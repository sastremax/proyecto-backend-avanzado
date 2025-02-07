import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// ruta abosoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ruta para leer el archivo JSON de productos
const productsFilePath = path.join(__dirname, '../data/products.json');

// para leer los productos desde el archivo JSON
const readProductsFromFile = () => {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

// funcion para escribir los productos al archivo JSON
const writeProductsToFile = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
};

// obtengo todos los productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);  // se agrega un limite de consultas mediante un parseo a entero
    const products = readProductsFromFile();  // se leeN los prodUtos del JSON
    const productsList = limit ? products.slice(0, limit) : products; // si especifico un limite se limitan los productos
    res.json(productsList);  // Respondo con la lista de todos los productos en formato JSON
});

// obtengo un producto por ID
router.get('/:pid', (req, res) => {
    const products = readProductsFromFile();  // leo los productos del archivo JSON
    const product = products.find(p => p.id == req.params.pid);  // Busco el producto con el ID que llega en los parámetros
    if (!product) {  //  Si no lo encuentro al producto
        res.status(404).send('Product not found');  //  el resultado sera un error
    }
    res.json(product);  // si lo encuentro devuelvo un JSON del producto
});

// agregar un producto nuevo
router.post('/', (req, res) => {
    const { title, price, description, code, status, stock, category, thumbnails } = req.body;  // Desestructuro los datos enviados en el body
    if (!title || !price || !description || !code || !status || !stock || !category || !thumbnails) {  // Verifico que todos los campos esten
        res.status(400).send('Required Fields not found');  // Si falta alguno la respuesta sera un 400
    }

    const products = readProductsFromFile();  // se leen los productos
    const newProduct = {
        id: products.length + 1,   // nuevo ID + 1 porque comienza en 0 y se autoincrementa
        title,
        price,
        description,
        code,
        status: status !== undefined ? status : true,   // si no envio el status queda como verdadero
        stock,
        category,
        thumbnails: thumbnails || [],       // si no envio una imagen queda con un array vacio
    };  // Creo un nuevo producto con los datos recibidos
    products.push(newProduct);   // Agrego el nuevo producto al arreglo de productos
    writeProductsToFile(products); // escribo los productos actualizados en el archivo JSON
    res.status(201).json(newProduct);   // da como resultado un 201
});

// Actualizar un producto ya existente
router.put('/:pid', (req, res) => {
    const { title, price, description, code, status, stock, category, thumbnails } = req.body;  // Desestructuro los datos enviados en el body

    if (!title || !price || !description || !code || !status || !stock || !category || !thumbnails) {  // si todos los campos no estan 
        return res.status(400).send('Required fields: (title, price, description, code, status, stock, category, thumbnails): someones are missing');  // arroja un 400
    }

    const products = readProductsFromFile();  // se leen los productos actuales
    const productIndex = products.findIndex(p => p.id === Number(req.params.pid));  // Busco el indice del producto con el ID

    if (productIndex === -1) {    // si no encuentro el indice del producto el producto no existe
        return res.status(404).send('Product not found');  // da como resultado un 404
    }

    const updatedProduct = {       // Actualizo el producto con los nuevos datos
        ...products[productIndex],   // la informacion antigua queda con spread operator
        title,           // y se modifican los datos con los nuevos cambios
        price,
        description,
        code,
        status,
        stock,
        category,
        thumbnails
    };

    products[productIndex] = updatedProduct;    // Actualizo el producto en el array
    writeProductsToFile(products);  // escribo los productos actualizados en el archivo JSON
    res.json(updatedProduct);    // da como resultado un producto modificado
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    const products = readProductsFromFile();  // leo los productos del archivo JSON
    const productIndex = products.findIndex(p => p.id === Number(req.params.pid));  // Busco el indice del producto a eliminar

    if (productIndex === -1) {     // si no encuentro el indice del producto
        return res.status(404).send('Product not found');   // da como resultado un 404
    }
    products.splice(productIndex, 1);    // elimino el producto
    writeProductsToFile(products);  // escribo los productos actualizados en el archivo JSON
    res.status(204).send('No content');  // da como resultado un 204 no content
});

export default router;   // exporto el router para que se pueda usar en el archivo principal