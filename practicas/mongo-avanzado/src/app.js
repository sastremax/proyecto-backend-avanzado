import mongoose from 'mongoose';
import { MONGO_URI } from './config.js';
import userModel from './models/users.js';

const enviroment = async() => {
    await mongoose.connect(MONGO_URI)

    const response = await userModel.find().explain('executionStats');
    console.log(response);
};

environment();



