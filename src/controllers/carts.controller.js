import Cart from '../models/Cart.model.js';

// obtengo un carrito por su id y lleno la información de los productos con populate()
const getCartById = async (req, res) => {
    try {
        const { id } = req.params;

        // busco el carrito en la base de datos y utilizo populate() para obtener los detalles de los productos
        const cart = await Cart.findById(id).populate('products.product', 'title price description');

        // si el carrito no existe, devuelvo un error 404
        if (!cart) {
            return res.status(404).json({ error: 'cart not found' });
        }

        res.json(cart); // devuelvo el carrito encontrado con sus productos

    } catch (error) {
        console.log('error getting cart by id:', error);  // muestro el error en consola
        res.status(500).json({ error: 'error getting cart by id' });  // devuelvo un error 500
    }
}

export default { getCartById };