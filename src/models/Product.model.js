import mongoose from "mongoose";

// defino el esquema para los productos
const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: { type: String, required: true },
    price: { type: Number, required: true},
    code: { type: String, required: true, unique: true},
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: String, default: 'available' },
    thumbails: { type: [String], default: [] }
})

// creo el modelo de producto basado en el esquema
const Product = mongoose.model('Product', productSchema);

export default Product;