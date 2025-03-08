import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    total_amount: { type: Number, index: true },
    products: [{
        product_id: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }],
    destination_address: String,
    destination_postal_code: { type: String, index: true },
    comments: String
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;