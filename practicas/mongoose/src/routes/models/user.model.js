import mongoose from "mongoose";

const userCollection = "usuarios"; // se llamara la colleccion de la base de datos

const userSchema = new mongoose.Schema({
    // seteo las propiedades que queremos que un usuario tenga en la aplicacion
    first_name: {
        type: String,
        required: true,
    },
    last_name: String,
    email: {       // si quiero usar mas detalles usamos las llaves
        type:String,   
        unique:true                // email unico
    }
})

/* 
Con mongoose.model genero el modelo funcional de un usuario
conectandose a la BD
*/
export const userModel = mongoose.model(userCollection, userSchema);
