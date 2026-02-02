import { TicketModel } from '../models/Ticket.model.js';
import { ProductModel } from '../models/Product.model.js';
import { CartModel } from '../models/Cart.model.js';
import { v4 as uuidv4 } from 'uuid';


export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartModel.findById(cid).populate('products.product');
        
        let totalAmount = 0;
        const productsNotPurchased = [];


        for (const item of cart.products) {
            const product = item.product;
            const quantity = item.quantity;

            if (product.stock >= quantity) {

                product.stock -= quantity;
                await product.save();
                totalAmount += product.price * quantity;
            } else {

                productsNotPurchased.push(item);
            }
        }


        cart.products = productsNotPurchased; 
        await cart.save();


        if (totalAmount > 0) {
            const ticket = await TicketModel.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email
            });
            
            return res.json({ 
                status: 'success', 
                message: 'Compra finalizada', 
                ticket, 
                not_purchased: productsNotPurchased.map(p => p.product._id) 
            });
        } else {
            return res.json({ status: 'error', message: 'No se pudo comprar ningún producto por falta de stock' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};