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
        const cart = await Cart.findById(id).populate({
            path: 'products.product',
            select: 'title price description stock category thumbnails',
            populate: {
                path: 'category',
                select: 'name'
            }
        });

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

// agrego un carrito vacio a la BASE DE DATOS
const createCart = async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });   // creo un carrito vacio
        await newCart.save();        // lo guardo en la base de datos
        res.status(201).json(newCart); // devuelvo el carrito creado con un estado 201

    } catch (error) {
        console.log('error creating cart', error);  // muestro el error en consola
        res.status(500).json({ error: 'error creating cart' }); // devuelvo un error 500
    }
};

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

const removeProductFromCart = async (req, res) => {
    try {
        const { id, productId } = req.params;

        // verifico si el carrito existe
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'cart not found' });
        }

        // filtro los productos y elimino el que tenga el productId
        const updatedProducts = cart.products.filter(p => p.product._id.toString() !== productId);

        // si el carrito no tenía el producto devuelvo un error 404
        if (updatedProducts.length === cart.products.length) {
            return res.status(404).json({ error: 'product not found in cart' });
        }

        cart.products = updatedProducts;
        await cart.save(); // guardo los cambios en la base de datos
        
        res.json({ message: 'product removed from cart', cart });
    } catch (error) {
        console.log('error removing product from cart:', error);
        res.status(500).json({ error: 'error removing product from cart' });
    }
};

// eliminar todos los productos del carrito
const clearCart = async (req, res) => {
    try {
        const { id } = req.params;

        //verifico si el carrito existe
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'cart not found' });
        }
        cart.products = []; // vacío el array de productos
        await cart.save();  // guardo los cambios en la base de datos
            res.json({ message: 'cart cleared successfully', cart});
    } catch (error) {
        console.log('error clearing cart:', error);  // devuelvo un error por consola
        res.status(500).json({ error: 'error clearing cart' });  // devuelvo un error 500
    }
}

// eliminar el carrito entero
const deleteCart = async (req, res) => {
    try {
        const { id } = req.params;

        // busco y elimino el carrito en la base de datos
        const deletedCart = await Cart.findByIdAndDelete(id);

        // si el carrito no existe devuelvo un error 404
        if (!deletedCart) {
            return res.status(404).json({ error: 'cart not found' });
        }

        res.json({ message: 'cart deleted successfully' }); // confirmo la eliminacion

    } catch (error) {
        console.log('error delete cart', error);
        res.status(500).json({ error: 'error deleting cart' });
    }
}

export default { getCartById, seedCarts, addProductToCart, removeProductFromCart, deleteCart, createCart, clearCart };