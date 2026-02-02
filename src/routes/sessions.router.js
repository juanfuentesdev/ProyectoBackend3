import { Router } from 'express';
import { UserModel } from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import passport from 'passport';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/User.repository.js';
import { sendRecoveryEmail } from '../utils/mailer.js';

const router = Router();
const userRepository = new UserRepository(UserModel);

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', error: 'Faltan datos' });
    try {
        const user = await UserModel.findOne({ email });
        if (!user || !user.isValidPassword(password)) return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });
        
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role, cart: user.cart }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 }).json({ status: 'success', message: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// CURRENT (Repository + DTO)
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userDTO = await userRepository.getUserCurrent(req.user);
        res.json({ status: 'success', payload: userDTO });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('authToken').json({ status: 'success', message: 'Sesión cerrada' });
});

// SOLICITAR RECUPERACIÓN (Forgot)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });

        const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await sendRecoveryEmail(email, token);
        res.json({ status: 'success', message: 'Correo enviado' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// RESTABLECER CONTRASEÑA (Reset)
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });

        if (bcrypt.compareSync(newPassword, user.password)) {
            return res.status(400).json({ status: 'error', error: 'No puedes usar la misma contraseña anterior' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ status: 'success', message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        res.status(400).json({ status: 'error', error: 'Token inválido o expirado' });
    }
});

export default router;