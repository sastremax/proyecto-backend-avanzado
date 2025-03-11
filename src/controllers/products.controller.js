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

export default { getProducts };