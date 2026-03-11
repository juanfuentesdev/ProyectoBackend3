import { Router } from 'express';
import { UserModel } from '../models/User.model.js';
import { CartDAO } from '../dao/Cart.dao.js'; 

const router = Router();
const cartDAO = new CartDAO();



router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});



router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ status: 'error', error: 'Faltan campos obligatorios.' });
    }

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: 'error', error: 'El correo electrónico ya está registrado.' });
        }

        const newCart = await cartDAO.create();


        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password,
            cart: newCart._id 
        });

        res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente.' });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor.' });
    }
});

export default router;