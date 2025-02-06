import { Router } from 'express';

const router = Router();

// array para almacenar
let users = [];

// metodo GET para obtener todos los recursos: (users)
router.get('/', (req, res) => {
    res.json(users);
})


// metodo POST para crear un nuevo recursos (usuarios)
router.post('/', (req, res) => {
    const newUser = req.body;    // la info de usuario vendra de : req.body
    users.push(newUser);
    res.json({ message: "User succesfully created" })
})




export default router;