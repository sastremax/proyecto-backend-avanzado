import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGO_URI } from './config.js';
import fs from 'fs/promises';
import path from 'path';

import Student from './models/students.js';
import Ticket from './models/tickets.js';
import DeliveryUser from './models/deliveryUsers.js';
import Book from './models/books.js';
import Course from './models/course.model.js';

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

        // Busco al estudiante
        let students = await Student.find().populate('courses.course');

        console.log('Estudiantes con cursos:', JSON.stringify(students, null, 2));

       
        /*

 // Estoy buscando los estudiantes ordenados por edad descendente
        const studentsSorted = await Student.find().sort({ age: -1 });
        console.log("Mostré los estudiantes ordenados por edad descendente:", studentsSorted);

        // Estoy buscando los primeros 5 tickets
        const ticketsLimited = await Ticket.find().limit(5);
        console.log("Mostré los primeros 5 tickets:", ticketsLimited);

        // Estoy buscando los 3 libros con mejor calificación
        const booksTopRated = await Book.find().sort({ rating: -1 }).limit(3);
        console.log("Mostré los 3 libros con mejor calificación:", booksTopRated);

        // Estoy buscando estudiantes con edad mayor o igual a 20 y nota mayor o igual a 8
        const studentsAnd = await Student.find({
            $and: [
                { age: { $gte: 20 } },
                { grade: { $gte: 8 } }
            ]
        });
        console.log("Mostré los estudiantes con edad mayor o igual a 20 y nota mayor o igual a 8:", studentsAnd);

        // Estoy buscando estudiantes llamados Juan o con nota mayor o igual a 9
        const studentsOr = await Student.find({
            $or: [
                { first_name: "Juan" },
                { grade: { $gte: 9 } }
            ]
        });
        console.log("Mostré los estudiantes llamados Juan o con nota mayor o igual a 9:", studentsOr);

        const studentOr = await Student.find({
            $or: [
                { last_name: "Perez" },
                { age: { $gte: 21} }
            ]
        });
        console.log("Mostré los estudiantes con apellido Perez o con edad mayor a 21:", studentOr);

        // Estoy buscando estudiantes con edad mayor o igual a 22
        const studentsGte = await Student.find({ age: { $gte: 22 } });
        console.log("Mostré los estudiantes con edad mayor o igual a 22:", studentsGte);

        // Estoy buscando tickets con monto menor o igual a 200
        const ticketsLte = await Ticket.find({ total_amount: { $lte: 200 } });
        console.log("Mostré los tickets con monto menor o igual a 200:", ticketsLte);

        // Estoy buscando usuarios de delivery en los códigos postales 1401 o 1402
        const usersIn = await DeliveryUser.find({ postal_code: { $in: ["1401", "1402"] } });
        console.log("Mostré los usuarios de delivery con código postal 1401 o 1402:", usersIn);

        // Estoy buscando libros que tienen rating
        const booksExists = await Book.find({ rating: { $exists: true } });
        console.log("Mostré los libros que tienen rating:", booksExists);
        
        // estoy creando nuevas consultas usando findOne()
        // estoy buscando un estudiante de nombre Pedro
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



