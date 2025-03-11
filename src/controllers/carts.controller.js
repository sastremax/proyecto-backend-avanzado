import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

// función para insertar 3 carritos de prueba en la base de datos
const seedCarts = async (req, res) => {
    try {
        const products = await Product.find(); // obtengo todos los productos de la base de datos

        if (products.length < 5) {
            return res.status(400).json({ error: 'not enough products to create carts' });
        }

        // creo 3 carritos de prueba con productos aleatorios
        const carts = [
            {
                products: [
                    { product: products[0]._id, quantity: 2 },
                    { product: products[1]._id, quantity: 1 }
                ]
            },
            {
                products: [
                    { product: products[2]._id, quantity: 3 },
                    { product: products[3]._id, quantity: 1 }
                ]
            },
            {
                products: [
                    { product: products[4]._id, quantity: 5 }
                ]
            }
        ];

        await Cart.insertMany(carts);
        res.status(201).json({ message: 'Carritos agregados con éxito' });
    } catch (error) {
        console.error('Error al insertar carritos:', error);
        res.status(500).json({ error: 'Error al insertar carritos' });
    }
};

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

// agrego un producto a un carrito en la base de datos
const addProductToCart = async (req, res) => {
    try {
        const { id, productId } = req.params;

        // busco el carrito en la base de datos
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'cart not found' });
        }
        // verifico si el producto existe
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ error: 'product not found' });
        }

        // busco si el producto ya se encuentra en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
        // si el producto existe entonces incremento la cantidad
            existingProduct.quantity += 1;
        } else {
            // si el producto no está en el carrito entonces asigno 1 de cantidad
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();   // guardo los cambios en la base de datos

        res.json(cart);  // devuelvo el carrito actualizado

    } catch (error) {
        console.log('error adding product to cart', error);
        res.status(500).json({ error: 'error adding product to cart' });
    }
}

export default { getCartById, seedCarts, addProductToCart };