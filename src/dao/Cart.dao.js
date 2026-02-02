import { CartModel } from '../models/Cart.model.js';

export class CartDAO {
    async create() {
        return await CartModel.create({ products: [] });
    }

    // Este método ahora se usa para MOSTRAR el carrito, por eso hace .populate()
    async getById(id) {
        // Usamos .lean() para obtener un objeto JSON simple y más rápido para las vistas
        return await CartModel.findById(id).populate('products.product').lean();
    }

    async addProduct(cid, pid) {
        // Para modificar, obtenemos el documento de Mongoose SIN popular
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // La lógica de búsqueda ahora es más simple
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        return await cart.save(); // Guardamos los cambios
    }

    async updateProducts(cid, products) {
        return await CartModel.findByIdAndUpdate(cid, { products }, { new: true });
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            return await cart.save();
        }
        return null; 
    }

    async removeProduct(cid, pid) {
        return await CartModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
    }

    // CAMBIO AQUÍ: Renombramos 'clear' a 'clearCart' para que coincida con el router
    async clearCart(cid) {
        return await CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
    }
}