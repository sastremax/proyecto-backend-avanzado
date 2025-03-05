import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/users.js';
import { MONGO_URI } from './config.js';

dotenv.config();
console.log(' MONGO_URI:', MONGO_URI);

const environment = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('conected');

        const response = await userModel.find({ first_name: "Celia" }).explain('executionStats');
        console.log(response);

        mongoose.connection.close();
        console.log('disconnect');
    } catch (error) {
        console.error('Error:', error.message);
    }
    
};

environment();



