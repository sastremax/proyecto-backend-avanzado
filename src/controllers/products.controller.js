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

// busco un producto por ID
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

// creo un producto nuevo
const addProduct = async (req,res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails } = req.body;
        if (!title || !description || !price || !code || !stock || !category) {
            return res.status(404).json({ error: 'missing required fields' });  // si no se encuentra alguno de los campos requeridos devuelvo un 404 not found
        }

        // creo un nuevo producto en la base de datos
        const newProduct = new Product({
            title,
            description,
            price,
            code,
            stock,
            category,
            status: req.body.status ? req.body.status : 'available',   // si no se adjunta por defecto el status es available
            thumbnails: thumbnails || []
        });

        await newProduct.save();  // guardo el producto en la base de datos
        res.status(201).json(newProduct); // devuelvo el producto creado con un estado 201
        
    } catch (error) {
        console.log('error adding product', error) 
        res.status(500).json({ error: 'error adding product' }); // devuelvo un error 500
    }
};

// actualizo un producto
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // valido si se enviaron campos para actualizar
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'no fields provided for update' });
        }

        // busco y actualizo el producto en la base de datos
        const updateProduct = await Product.findByIdAndUpdate(id, updateFields, { new : true });

        // si no se encuentra el producto, devuelvo un error 404
        if (!updateProduct) {
            return res.status(404).json({ error: 'product not found' });
        }

        // devuelvo el producto actualizado
        res.json(updatedProduct);

    } catch (error) {
        console.log('errorupdating product:', error);   // muestro el error en consola
        res.status(500).json({ error: 'error updating product' }); // devuelvo un error 500
    }
}

// elimino un producto de la base de datos
const deleteProduct = async (req,res) => {
    try {
        const { id } = req.params;

        // busco y elimino el producto en la base de datos
        const deletedProduct = await Product.findByIdAndDelete(id);

        // si el producto no existe devuelvo un error 404
        if (!deletedProduct) {
            return res.status(404).json({ error: 'product not found' });
        }

        res.json({ message: 'product deleted successfully' })  // confirmo la eliminacion

    } catch (error) {
        console.log('error deleting product:', error);
        res.status(500).json({ error: 'error deleting product' }); // devuelvo un error 500
    }
}

export default { getProducts, getProductById, addProduct, updateProduct, deleteProduct };