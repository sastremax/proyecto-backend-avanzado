import mongoose from 'mongoose';

const orderCollection = 'orders';

const orderSchema = mongoose.Schema({
    flavor: String,
    size: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium"
    },
    price: Number,
    quantity: Number,
    orderDate: Date
});

const orderModel = mongoose.model(orderCollection, orderSchema);

export default orderModel;