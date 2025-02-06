import express from 'express';

const router = express.Router();

// array de productos en memoria
let products = [
    { id: 1, title: 'Product 1', price: 1200, description: 'Description product 1' },
    { id: 2, title: 'Product 2', price: 2800, description: 'Description product 2' }
];

// obtengo todos los productos
router.get('/', (req, res) => {
    res.json(products);  // Respondo con la lista de todos los productos en formato JSON
});

// obtengo un producto por ID
router.get('/:pid', (req, res) => {
    const product = products.find(p => p.id == req.params.pid);  // Busco el producto con el ID que llega en los parámetros
    if (!product) {  //  Si no lo encuentro al producto
        res.status(404).send('Product not found');  //  el resultado sera un error
    }
    res.json(product);  // si lo encuentro devuelvo un JSON del producto
});

// agregar un producto nuevo
router.post('/', (req, res) => {
    const { title, price, description } = req.body;  // Desestructuro los datos enviados en el body
    if (!title || !price || !description) {  // Verifico que todos los campos esten
        res.status(400).send('Required Fields not found');  // Si falta alguno la respuesta sera un 400
    }
    const newProduct =
    {
        id: products.length + 1,   // nuevo ID + 1 porque comienza en 0 y se autoincrementa
        title,
        price,
        description
    };  // Creo un nuevo producto con los datos recibidos
    products.push(newProduct);   // Agrego el nuevo producto al arreglo de productos
    res.status(201).json(newProduct);   // da como resultado un 201
});

// Actualizar un producto ya existente
router.put('/:pid', (req, res) => {
    const { title, price, description } = req.body;  // Desestructuro los datos enviados en el body
    const productIndex = products.findIndex(p => p.id == req.params.pid);  // Busco el indice del producto con el ID

    if (productIndex === -1) {    // si no encuentro el indice del producto el producto no existe
        return res.status(404).send('Product not found');  // da como resultado un 404
    }

    const updatedProduct = {       // Actualizo el producto con los nuevos datos
        ...products[productIndex],   // la informacion antigua queda
        title,           // y se modifican los datos con los nuevos cambios
        price,
        description,
    };

    products[productIndex] = updatedProduct;    // Actualizo el producto en el array
    res.json(updatedProduct);    // da como resultado un producto modificado
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.pid);  // Busco el indice del producto a eliminar

    if (productIndex === -1) {     // si no encuentro el indice del producto
        return res.status(404).send('Product not found');   // da como resultado un 404
    }
    products.splice(productIndex, 1);    // elimino el producto
    res.status(204);  // da como resultado un 204 no content
});

export default router;   // exporto el router para que se pueda usar en el archivo principal