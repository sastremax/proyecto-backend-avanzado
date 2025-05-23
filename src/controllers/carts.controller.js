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
        const { quantity } = req.body;

        // verifico que la cantidad sea válida, si no es válida asigno 1
        const qty = parseInt(quantity) > 0 ? parseInt(quantity) : 1;

        // busco el carrito por id
        const cart = await Cart.findById(id);
        if (!cart) return res.status(404).json({ error: 'cart not found' });

        // verifico que el producto exista
        const productExists = await Product.findById(productId);
        if (!productExists) return res.status(404).json({ error: 'product not found' });

        // busco si el producto ya está en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            // si ya está, le sumo la cantidad enviada
            existingProduct.quantity += qty;
        } else {
            // si no está, lo agrego con la cantidad enviada
            cart.products.push({ product: productId, quantity: qty });
        }

        await cart.save();   // guardo los cambios en la base de datos

        // devuelvo una respuesta con el carrito actualizado
        res.json({ message: "Product added successfully", cart }); // devuelvo el carrito actualizado

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

// actualizo el carrito con un nuevo conjunto de productos
const updateCart = async (req, res) => {
    try {
        const { id } = req.params;   // obtengo el id del carrito desde los parametros de la URL
        const { products } = req.body;  // recibo el nuevo array de productos desde el BODY de la peticion

        // muestro en consola el body recibido para verificar si products llega correctamente
        console.log('----- DEPURACIÓN: BODY RECIBIDO EN PUT /api/carts/:id -----');
        console.log('Request body:', req.body);
        console.log('Products received:', products);


        //valido que se este enviando un array de productos
        if (!products || !Array.isArray(products) || products.length === 0) {
            console.log('ERROR: El body de la petición no tiene un array válido de productos.');
            return res.status(400).json({ error: 'products must be a non-empty array' });  // si no es un array o no existe devuelvo un 400
        }

        // busco el carrito y actualizo el carrito
        const cart = await Cart.findById(id);

        // si el carrito no existe devuelvo un 404 not found
        if (!cart) {
            console.log('carrito no encontrado');
            return res.status(404).json({ error: 'cart not found' });
        }

        // reemplazo los productos actuales por los nuevos
        cart.products = products;
        await cart.save(); // guardo los cambios en la base de datos

        // devuelvo un mensaje de éxito junto con el carrito actualizado
        res.json({ message: 'cart updated successfully', Cart });
    } catch (error) {
        console.log('error updating cart:', error);
        res.status(500).json({ error: 'error updating cart' });
    }
}

// actualizo la cantidad de un producto dentro de un carrito
const updateProductQuantity = async (req, res) => {
    try {
        const { id, productId } = req.params;   // obtengo el id del carrito y el id del producto desde los parametros
        const { quantity } = req.body;  // obtengo la nueva cantidad desde el body de la peticion

        // valido que la cantidad sea un numero valido
        if (!quantity || quantity <=0) {
            return res.status(400).json({ error: 'invalid quantity' });  // devuelvo un error 400
        }

        // busco el carrito en la base de datos
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ error: 'cart not found' });  // devuelvo error 404
        }

        // busco el producto dentro del carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'product not found in cart' });    // devuelvo error 404 si no esta el producto en el carrtio
        }

        // busco el producto en la base de datos para validar su stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'product not found in database' });
        }

        // verifico si la cantidad solicitada supera el stock disponible
        if (quantity > product.stock) {
            return res.status(400).json({ error: `not enough stock available, only ${product.stock} left` });
        }

        // actualizo la cantidad del producto
        cart.products[productIndex].quantity = quantity;
        await cart.save(); // guardo los cambios en la base de datos

        // devuelvo un mensaje de éxito
        res.json({ message: 'product quantity updated', cart });

    } catch (error) {
        console.log('error updating product quantity:', error);
        res.status(500).json({ error: 'error updating product quantity' });   // devuelvo un error 500
    }
}

export default { getCartById, seedCarts, addProductToCart, removeProductFromCart, deleteCart, createCart, clearCart, updateCart, updateProductQuantity };