import Product from "../models/Product.model.js";

// obtengo todos los productos desde la base de datos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find(); // con el metodo find obtengo todos los productos de la Base de Datos
        res.json(products);  // luego envio la respuesta en formato json
    } catch (error) {
        console.error('error getting products:', error)   // muiestro el error en consola
        res.status(500).json({ error: 'error getting products' })  // devuelvo un error 500 de server
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await product.findById(req.params.id);    // busco el producto en la base de datos por su ID
        if (!product) {
            return res.status(404).json({ error: 'product not found' });  // si no se encuentra el producto devuelvo un 404 not found
        }
        res.json(product); // si lo encuentra envio  la respuesta con el producto en formato JSON
    } catch (error) {
        console.log('error getting product by id:', error)    // muestro el error en consola
        res.status(500).json({ error: 'error getting product by id' })   // devuelvo un error 500
    }
}

export default { getProducts, getProductById };