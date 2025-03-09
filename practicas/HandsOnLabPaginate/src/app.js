import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import dotenv from 'dotenv';

dotenv.config()

const app = express();

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error en conexión a MongoDB:", err));


app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views')
app.set('view engine','handlebars');

app.use('/',viewsRouter);
app.listen(8080,()=>console.log("Listening on PORT 8080"))