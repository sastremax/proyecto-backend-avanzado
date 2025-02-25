import { Router } from 'express';
import { userModel } from './models/user.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let user = await userModel.find();  // es un find identico en cliente cli
        res.send({result: "success", payload: users})
    } catch (error) {
        console.log('Cannot get users with mongoose: '+error)
    }
});

export default router;