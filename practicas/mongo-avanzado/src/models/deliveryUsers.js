import mongoose from 'mongoose';

const deliveryUserSchema = new mongoose.Schema({
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    email: { type: String, unique: true },
    telephone: String,
    age: Number,
    gender: String,
    address: String,
    postal_code: { type: String, index: true }
});

const DeliveryUser = mongoose.model('DeliveryUser', deliveryUserSchema);
export default DeliveryUser;