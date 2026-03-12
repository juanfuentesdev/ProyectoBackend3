import { Router } from 'express';
import { CartDAO } from '../dao/Cart.dao.js';
import { purchaseCart } from '../controllers/carts.controller.js'; 
import passport from 'passport'; 
import { authorization } from '../middlewares/auth.middleware.js'; 

const router = Router();
const cartDAO = new CartDAO();


router.post('/', async (req, res) => {
    try {
        const newCart = await cartDAO.create();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartDAO.getById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

router.post('/:cid/products/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('user'), 
    async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartDAO.addProduct(cid, pid);
            res.json({ status: 'success', payload: updatedCart });
        } catch (error) {
            // 👇 ESTA ES LA LÍNEA MÁGICA QUE NOS DIRÁ QUÉ PASA
            console.error("🚨🚨🚨 ERROR EXPLOSIVO EN EL CARRITO:", error); 
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
);


router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartDAO.removeProduct(cid, pid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});



router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartDAO.updateCart(cid, req.body.products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartDAO.updateProductQuantity(cid, pid, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartDAO.clearCart(cid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }), 
    purchaseCart
);

export default router;