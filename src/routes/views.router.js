import { Router } from 'express';
import { ProductDAO } from '../dao/Product.dao.js';
import { CartDAO } from '../dao/Cart.dao.js';
import passport from 'passport'; // 👈 IMPORTANTE: Traemos al guardia de seguridad

const router = Router();
const productDAO = new ProductDAO();
const cartDAO = new CartDAO();

// Vista de productos con paginación
// 👇 Agregamos passport para proteger la ruta y obtener al usuario
router.get('/products', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const productsData = await productDAO.getAll({ limit, page, sort, query });
    
    // 👇 TRUCO NINJA: Convertimos el usuario de Mongoose a un objeto plano
    const user = req.user ? JSON.parse(JSON.stringify(req.user)) : null;
    
    res.render('products', { products: productsData, user: user }); 
});
// Vista de detalle de producto
router.get('/products/:pid', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async (req, res) => {
    const product = await productDAO.getById(req.params.pid);
    
    // 👇 Aplicamos el mismo truco aquí
    const user = req.user ? JSON.parse(JSON.stringify(req.user)) : null;

    res.render('productDetail', { product, user: user });
});

// Vista de un carrito específico
router.get('/carts/:cid', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async (req, res) => {
    const cart = await cartDAO.getById(req.params.cid);
    res.render('cart', { cart, user: req.user });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

// NUEVAS RUTAS DE RECUPERACIÓN
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    res.render('resetPassword', { token });
});

export default router;