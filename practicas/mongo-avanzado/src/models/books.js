import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, index: true },
    description: String,
    prize: Number,
    reviews: [String],
    rating: { type: Number, index: true },
    images: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', index: true },
    num_of_pages: Number
});

const Book = mongoose.model('Book', bookSchema);
export default Book;