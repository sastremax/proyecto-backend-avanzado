import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';
import userModel from './models/users.js';

dotenv.config();

const enviroment = async() => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('conected');

    const response = await userModel.find({ first_name: "Celia" }).explain('executionStats');
    console.log(response);
};

environment();



