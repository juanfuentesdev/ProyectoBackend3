import { Router } from 'express';
import { ProductDAO } from '../dao/Product.dao.js';
import { CartDAO } from '../dao/Cart.dao.js';

const router = Router();
const productDAO = new ProductDAO();
const cartDAO = new CartDAO();

// Vista de productos con paginación
router.get('/products', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const productsData = await productDAO.getAll({ limit, page, sort, query });
    res.render('products', { products: productsData }); 
});

// Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
    const product = await productDAO.getById(req.params.pid);
    res.render('productDetail', { product });
});

// Vista de un carrito específico
router.get('/carts/:cid', async (req, res) => {
    const cart = await cartDAO.getById(req.params.cid);
    res.render('cart', { cart });
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