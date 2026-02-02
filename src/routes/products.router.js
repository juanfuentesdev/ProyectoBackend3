import { Router } from 'express';
import { ProductDAO } from '../dao/Product.dao.js';
import passport from 'passport';
import { authorization } from '../middlewares/auth.middleware.js';

const router = Router();
const productDAO = new ProductDAO();


router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query, availability } = req.query;

        const result = await productDAO.getAll({ limit, page, sort, query, availability });


        const baseURL = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const prevLink = result.hasPrevPage 
            ? `${baseURL}?page=${result.prevPage}&limit=${result.limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` 
            : null;
        const nextLink = result.hasNextPage 
            ? `${baseURL}?page=${result.nextPage}&limit=${result.limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` 
            : null;

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const product = await productDAO.getById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.post('/', passport.authenticate('jwt', { session: false }), authorization('admin'), async (req, res) => {
    try {
        const newProduct = await productDAO.create(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});


router.put('/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('admin'), 
    async (req, res) => {
        try {
            const updatedProduct = await productDAO.update(req.params.pid, req.body);
            if (!updatedProduct) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            res.json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
);


router.delete('/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization('admin'), 
    async (req, res) => {
        try {
            const deletedProduct = await productDAO.delete(req.params.pid);
            if (!deletedProduct) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            res.json({ status: 'success', payload: deletedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
);

export default router;