import Product from "../models/Product.model.js";

// función para insertar productos de prueba en la base de datos
const seedProducts = async (req, res) => {
    try {
        const products = [
            {
                title: "Smart Tv Qled 50''",
                price: 801099,
                description: "Smart TV RCA QL50CH100-F. Este televisor QLED de 50 pulgadas combina calidad de imagen Ultra HD 4K.",
                code: "P001",
                status: "available",
                stock: 100,
                category: "tv",
                thumbnails: [
                    "/img/632830-MLA81409765455_122024-F.webp",
                    "/img/1739130402536-882348-MLU78161249435_082024-O.webp"
                ]
            },
            {
                title: "Celular Samsung Galaxy A55 5g 256/ 8gb",
                price: 799999,
                description: "Celular Samsung Galaxy A55 5g 256/ 8gb Tipo de CPU Octa-Núcleo 2,75 GHz",
                code: "P002",
                status: "available",
                stock: 50,
                category: "phone",
                thumbnails: ["/img/794825-MLA80865429208_122024-O.webp"]
            },
            {
                title: "Heladera LG Side By Side",
                price: 17999999,
                description: "Heladera LG Side By Side French Door 708 Lts, Con tecnología inverter: Sí, ",
                code: "P003",
                status: "available",
                stock: 1,
                category: "refrigeracion",
                thumbnails: ["/img/952866-MLA41478756034_042020-O.webp"]
            },
            {
                title: "Bafle JBL Eon 618s Subwoofer Activo 1000W",
                price: 3480000000,
                description: "El JBL EON618S es un subwoofer activo de 18 pulgadas diseñado para ofrecer un sonido potente y profundo.",
                code: "P005",
                status: "available",
                stock: 5,
                category: "audio",
                thumbnails: ["/img/777887-MLA79687001017_102024-F.webp"]
            },
            {
                title: "Samsung Unidad Enfriadora Condensación Por Aire 100TR",
                price: 207740383.24,
                description: "La unidad enfriadora Samsung con condensación por aire de 100TR es ideal para gran consumo energético.",
                code: "P007",
                stock: 20,
                category: "climatizacion",
                thumbnails: []
            },
            {
                title: "Sony Unidad Enfriadora Condensación Por Aire 150TR",
                price: 3000000.24,
                description: "La unidad enfriadora Sony con condensación por aire de 150TR es comercial. con bajo consumo energético.",
                code: "P008",
                stock: 50,
                category: "climatizacion",
                thumbnails: []
            }
        ];

        await Product.insertMany(products);
        res.status(201).json({ message: 'Productos agregados con éxito' });
    } catch (error) {
        console.error('Error al insertar productos:', error);
        res.status(500).json({ error: 'Error al insertar productos' });
    }
};

// obtengo todos los productos desde la base de datos con paginacion y filtros
const getProducts = async (req, res) => {
    try {
        // obtengo los parámetros de consulta con valores por defecto
        const limit = isNaN(req.query.limit) ? 10 : parseInt(req.query.limit);
        const page = isNaN(req.query.page) ? 1 : parseInt(req.query.page);
        const { sort, query } = req.query;

        // agrego el filtro basado en el parametro query
        let filter = {};
        if (query) {
            const queryParts = query.split(':');
            if (queryParts.length === 2) {
                const [key, value] = queryParts;
                filter[key] = { $regex: value, $options: "i" };   // filtro flexible e insensible a mayusculas
            }
        }

        // agrego opciones de paginacion y ordenamiento
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort && (sort === "asc" || sort === "desc") ? { price: sort === "asc" ? 1 : -1 } : undefined // ordeno solo por ascendente o descendente
        };

        // realizo la consulta paginada con filtros
        const result = await Product.paginate(filter, options);

        // devuelvo el resultado con la estructura solicitada
        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null
        });
        
    } catch (error) {
        console.error('error getting products:', error)   // muiestro el error en consola
        res.status(500).json({ error: 'error getting products' })  // devuelvo un error 500 de server
    }
};

// busco un producto por ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);    // busco el producto en la base de datos por su ID
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
        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new : true });

        // si no se encuentra el producto, devuelvo un error 404
        if (!updatedProduct) {
            return res.status(404).json({ error: 'product not found' });
        }

        // devuelvo el producto actualizado
        res.json(updatedProduct);

    } catch (error) {
        console.log('errorupdating product:', error);   // muestro el error en consola
        res.status(500).json({ error: 'error updating product' }); // devuelvo un error 500
    }
}

const updateProductView = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send("No fields provided for update.");
        }

        // Busco y actualizo el producto en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).send("Product not found.");
        }

        // Redirigir con un parámetro de éxito
        res.redirect(`/products/details/${id}?success=2`);

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product.");
    }
};

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

// eliminar un producto desde el navegador
const deleteProductView = async (req, res) => {
    try {
        const { id } = req.params;

        // Busco y elimino el producto en la base de datos
        const deletedProduct = await Product.findByIdAndDelete(id);

        // Si el producto no existe, devuelvo un error 404
        if (!deletedProduct) {
            return res.status(404).send("Product not found.");
        }

        // Redirigir a la lista de productos después de eliminar
        res.redirect("/products/view");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product.");
    }
};

// Función auxiliar para construir filtros de búsqueda
const parseFilters = (req) => {
    let filter = {};

    if (req.query.query) {
        const queryParts = req.query.query.split(':');
        if (queryParts.length === 2) {
            const [key, value] = queryParts;
            filter[key] = key === "status" ? value : { $regex: value, $options: "i" };
        }
    }

    if (req.query.availability) {
        if (req.query.availability === "available") {
            filter.stock = { $gt: 0 }; // Productos con stock mayor a 0
        } else if (req.query.availability === "unavailable") {
            filter.stock = 0; // Productos sin stock
        }
    }

    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    return filter;
};

// Función auxiliar para construir las opciones de paginación
const getPaginationOptions = (req) => ({
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: req.query.sort && (req.query.sort === "asc" || req.query.sort === "desc")
        ? { price: req.query.sort === "asc" ? 1 : -1 }
        : undefined
});

const getProductDetailsView = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).render('error', { message: 'Product not found' });
        }

        res.render('productDetails.handlebars', {
            layout: "main",
            product
        });
    } catch (error) {
        console.error('Error rendering product details:', error);
        res.status(500).send('Error loading product details page');
    }
};

// función que actualiza el producto en la base de datos agregando una imagen
const updateProductImage = async (id, imagePath) => {
    try {
        const product = await Product.findById(id); // busco el producto por id
        if (!product) {
            return null; // si no lo encuentro, retorno null
        }

        // verifico si "thumbnails" es un array, si no lo inicializo
        if (!Array.isArray(product.thumbnails)) {
            product.thumbnails = [];
        }

        product.thumbnails.push(imagePath); // agrego la imagen al array de thumbnails
        await product.save(); // guardo los cambios en la base de datos

        return product; // retorno el producto actualizado
    } catch (error) {
        console.error('error updating product image:', error);
        return null;
    }
};

// controlador que maneja la subida de imágenes
const uploadProductImage = async (req, res) => {
    try {
        const { id } = req.params; // obtengo el id del producto
        if (!req.file) {
            return res.status(400).send("no image uploaded."); // si no hay imagen, retorno error 400
        }

        const imagePath = `/img/${req.file.filename}`; // ruta de la imagen subida
        const product = await updateProductImage(id, imagePath); // llamo a la función que actualiza la imagen

        if (!product) {
            return res.status(404).send("product not found."); // si no se encuentra el producto, retorno error 404
        }

        // en vez de devolver json, redirige a la misma página del producto con ?success=1
        res.redirect(`/views/products/details/${id}?success=1`);
    } catch (error) {
        console.error("error uploading product image:", error);
        res.status(500).send("error uploading image."); // manejo de errores con código 500
    }
};

const getHomeView = async (req, res) => {
    try {
        const products = await Product.find(); // obtengo todos los productos de la base de datos
        res.render('home', { layout: "main", products }); // renderizo la vista de home con los productos
    } catch (error) {
        console.error('Error rendering home:', error); // muestro el error en consola
        res.status(500).send('Error loading home page'); // devuelvo un error 500 si hay problema en la carga
    }
};

export {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    updateProductView,
    updateProductImage,
    deleteProduct,
    deleteProductView,
    seedProducts,
    uploadProductImage,
    getProductDetailsView,
    getHomeView,
    parseFilters,
    getPaginationOptions
};