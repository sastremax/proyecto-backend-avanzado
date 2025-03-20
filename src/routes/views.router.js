import { Router } from 'express';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import multer from 'multer';
import mongoose from "mongoose";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img'); // Guarda las imágenes en la carpeta 'public/img'
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
// Middleware de Multer
const upload = multer({ storage });

const router = Router();

// vista de  carritos
router.get('/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate("products.product");
        console.log(cart.products);
        if (!cart || !cart.products) {
            return res.status(404).render("error", { message: "Cart not found" });
        }

        // FILTRO productos nulos antes de enviar a la vista
        //cart.products = cart.products.filter(p => p.product !== null);

        res.render("cart", { layout: "main", cart });
    } catch (error) {
        console.error("Error loading cart view:", error);
        res.status(500).send("Error loading cart page");
    }
});

// vista de productos
router.get('/products/view', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database connection lost");
        }

        const { category, minPrice, maxPrice, inStock, sort, search, page = 1, limit = 10 } = req.query;

        // Obtener todas las categorías únicas desde MongoDB
        const categories = await Product.distinct("category");

        // Construcción del filtro dinámico
        let filter = {};
        if (category) filter.category = category;
        if (minPrice) filter.price = { $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
        if (inStock === "true") filter.stock = { $gt: 0 };
        if (inStock === "false") filter.stock = 0;
        if (search) filter.title = new RegExp(search, "i");

        // Opciones de ordenamiento
        let sortOptions = {};
        if (sort === "asc") sortOptions.price = 1;
        if (sort === "desc") sortOptions.price = -1;

        // Consulta con filtros y paginación
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOptions
        };
        const result = await Product.paginate(filter, options);

        // Construcción de la query string para mantener los filtros
        const queryString = `&category=${category || ''}&minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&inStock=${inStock || ''}&sort=${sort || ''}&search=${search || ''}`;

        res.render("products.handlebars", {
            layout: "main",
            products: result.docs,
            categories,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/views/products/view?page=${result.prevPage}&limit=${limit}${queryString}` : null,
            nextLink: result.hasNextPage ? `/views/products/view?page=${result.nextPage}&limit=${limit}${queryString}` : null,
        });
    } catch (error) {
        console.log("Error rendering products:", error);
        res.status(500).send("Error loading products page");
    }
});

// Vista de detalles de un producto
router.get('/products/details/:id', async (req, res) => {
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
});

// Vista para actualizar un producto desde el navegador
router.post('/products/update/:id', async (req, res) => {
    try {

        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database connection lost");
        }
        const { id } = req.params;
        const updateFields = req.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).send("No fields provided for update.");
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).send("Product not found.");
        }

        res.redirect(`/views/products/details/${id}?success=2`);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product.");
    }
});

// Vista para eliminar un producto desde el navegador
router.post('/products/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send("Product not found.");
        }

        res.redirect("/views/products/view");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product.");
    }
});

// Middleware para subir imágenes desde el navegador
router.post('/products/:id/upload', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).send("No image uploaded.");
        }

        const imagePath = `/img/${req.file.filename}`;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        if (!Array.isArray(product.thumbnails)) {
            product.thumbnails = [];
        }

        product.thumbnails.push(imagePath);
        await product.save();

        res.redirect(`/views/products/details/${id}?success=1`);
    } catch (error) {
        console.error("Error uploading product image:", error);
        res.status(500).send("Error uploading image.");
    }
});

export default router;