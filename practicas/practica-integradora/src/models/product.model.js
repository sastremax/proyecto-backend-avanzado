import mongoose from "mongoose";

const { Schema } = mongoose;

const productCollection = 'product';
// defino el esquema para el producto
const productSchema = new Schema({
    cod: { type: Number, required: true, unique: true },
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
})

const ProductModel = mongoose.model(productCollection, productSchema)

export default ProductModel;