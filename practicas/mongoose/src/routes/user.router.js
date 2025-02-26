import { Router } from 'express';
import { alumnoModel } from './models/user.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        // Buscar todos los documentos en la colección 'alumnos'
        let users = await alumnoModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        console.log('Cannot get users with mongoose: ' + error);
        res.status(500).send({ result: "error", message: "Unable to fetch users" });
    }
});

export default router;