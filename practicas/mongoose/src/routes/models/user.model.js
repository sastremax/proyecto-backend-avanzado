import mongoose from "mongoose";

// Definimos la colección de la base de datos
const userCollection = "alumnos"; // colección en la base de datos 'estudiantes'

const alumnoSchema = new mongoose.Schema({
    // seteo las propiedades que queremos que un usuario tenga en la aplicación
    nombre: {
        type: String,
        required: true,
    },
    edad: String,
    genero: String,
    curso: String,
});

// Con mongoose.model genero el modelo funcional de un usuario
// El primer parámetro es el nombre del modelo (usamos 'Alumno' como nombre) 
// y el segundo parámetro es el esquema
export const alumnoModel = mongoose.model('Alumno', alumnoSchema, userCollection);
