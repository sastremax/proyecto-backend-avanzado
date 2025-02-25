import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Lista de usuarios');
});

router.post('/', (req, res) => {
    res.send('Crear un nuevo usuario');
});

export default router;