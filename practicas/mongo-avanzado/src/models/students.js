import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    email: { type: String, unique: true },
    telephone: String,
    age: Number,
    grade: { type: Number, index: true },
    gender: String,
    address: String,
    courses: { 
        type: [
            { 
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "courses" 
                }
            }
        ], 
    default: []
    }
});

// Middleware "pre" para hacer populate() automaticamente
studentSchema.pre('find', function (next) {
    this.populate('courses.course');   // Popula automáticamente la referencia a los cursos
    next();
});

const Student = mongoose.model('students', studentSchema);
export default Student;

