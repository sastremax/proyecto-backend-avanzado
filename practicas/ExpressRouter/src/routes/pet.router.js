import { Router } from 'express';

const router = Router();

// array para almacenar
let pets = [];

// metodo GET para obtener todos los recursos: (pets)
router.get('/', (req, res) => {
    res.json(pets);
})


// metodo POST para crear un nuevo recursos (usuarios)
router.post('/', (req, res) => {
    const newPet = req.body;    // la info de usuario vendra de : req.body
    pets.push(newPet);
    res.json({ message: "Pet succesfully created" })
})







export default router;