import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    email: { type: String, unique: true },
    telephone: String,
    age: Number,
    grade: { type: Number, index: true },
    gender: String,
    address: String
});

const Student = mongoose.model('Student', studentSchema);
export default Student;

