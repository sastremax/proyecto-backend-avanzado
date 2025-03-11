import mongoose from 'mongoose';

// defino el esquema para los carritos
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
})

// creo el modelo de carrito basado en el esquema
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;