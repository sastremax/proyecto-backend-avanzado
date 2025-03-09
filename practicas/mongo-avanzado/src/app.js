import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGO_URI } from './config.js';
import fs from 'fs/promises';
import path from 'path';

import Student from './models/students.js';
import Ticket from './models/tickets.js';
import DeliveryUser from './models/deliveryUsers.js';
import Book from './models/books.js';

dotenv.config();
console.log(' MONGO_URI:', MONGO_URI);

const loadStudents = async () => {
    const filePath = path.resolve('src', 'data', 'users.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const users = JSON.parse(data);

    await userModel.deleteMany({});
    await userModel.insertMany(users);
};

// funcion para ejecutar consultas
const environment = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('conected');

        // estoy creando nuevas consultas usando findOne()
        const studentData = await Student.findOne({ first_name: "Pedro" });
        console.log('muestro los datos del estudiante:', studentData);

        // estoy buscando tickets con total_amount mayor a 100
        const ticketData = await Ticket.find({ total_amount: { $gt: 100} });
        console.log('muestro los tickets con un monto que es mayor a 100', ticketData);

        // estoy buscando un usuario de delivery por código postal
        const userData = await DeliveryUser.findOne({ postal_code: '1401' });
        console.log('muestro los datos de un usuario de deliver:', userData );

        // buscando un libro por titulo
        const bookData = await Book.findOne({ title: 'MongoDB Essentials' });
        console.log('mostre los datos de un libro:', bookData);


        /*
        estoy dejando el código con find() comentado para pruebas futuras
        const studentStats = await Student.find({ first_name: "Juan" }).explain('executionStats');
        console.log('Mostré las estadísticas de consulta de estudiantes', studentStats);

        const ticketStats = await Ticket.find({ total_amount: { $gt: 50 } }).explain('executionStats');
        console.log('Mostré las estadísticas de consulta de tickets', ticketStats);

        const userStats = await DeliveryUser.find({ postal_code: "1000" }).explain('executionStats');
        console.log('Mostré las estadísticas de consulta de usuarios de delivery', userStats);

        const bookStats = await Book.find({ title: /JavaScript/i }).explain('executionStats');
        console.log('Mostré las estadísticas de consulta de libros', bookStats);
        */

        mongoose.connection.close();
        console.log('Desconecté de MongoDB');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
};

environment();



