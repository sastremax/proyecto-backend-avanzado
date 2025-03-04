// operaciones CRUD pero devuelvo respuestas con vistas renderizadas
import { Router } from 'express';
import ProductModel from '../models/product.model.js';

const router = Router();

// C Create
router.post('/', async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        console.log('info of body', req.body)

        await newProduct.save();  //  guardo el producto en MongoDB
        res.json({ status: "success", product: newProduct });
    } catch (error) {
        console.error('Error when you create a product', error);
        return res.status(500).json({ mesagge: 'Error when you create a product' });
    }
});

// R Read
router.get('/:cod', async (req, res) => {
    try {
        const product = await ProductModel.findOne({ cod: req.params.cod });
        if (!product) {
            return res.json({ error: "error" });
        }
        res.render('product', { product: product.toObject() });
    } catch (error) {
        return res.send({ message: "error" });
    }
});

router.get('/', async (req, res) => {
    try {
        let products = await ProductModel.find();
        products = products.map(product => product.toObject());
        res.render('products', { products: products });
    } catch (error) {
        return res.render('error', { error: "Error al obtener todos los productos" })
    }
})

// U Update


// D Delete


export default router;