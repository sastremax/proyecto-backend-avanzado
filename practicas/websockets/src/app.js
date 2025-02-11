import { ExpressHandlebars } from "express-handlebars";
import express from 'express';
import __dirname from './utils';

const app = express();
const httpServer = app.listen(8080, () => console log('Listening on port 8080'));

app.engine('handlebars, handlebars.engine');
app.set('views', __dirname + '/views');
app.set(wiews)
