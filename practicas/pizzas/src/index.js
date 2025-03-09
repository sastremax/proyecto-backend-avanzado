import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('conectado a MongoDb atlas');
    } catch (error) {
        console.log('Error al conectar a la base de datos', error);
        process.exit(1);
    }
};

const environment = async () => {
    await connectDB();
};

environment();