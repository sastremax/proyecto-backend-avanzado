import mongoose from 'mongoose';

// defino el esquema para los carritos con validaciones mejoradas
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // valido que el producto referenciado sea obligatorio
            quantity: { type: Number, required: true, min: 1, default: 1 }  // valido que la cantidad sea obligatoria y mayor a 0
        }
    ]
}, { timestamps: true });  // agrego timestamps para registrar automáticamente la fecha de creación y actualizacion

// creo el modelo de carrito basado en el esquema
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;