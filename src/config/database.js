import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // me conecto a la base de datos de mongodb usando la url que está en las variables de entorno
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');  // si la conexión es exitosa mensaje exitoso
    } catch (error) {
        console.log('MongoDB connection error', error);  // si la conexión no es exitosa muestro un error 
        process.exit(1);    // y detengo la ejecucion
    }
}

export default connectDB;
