import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    // Método para leer los carritos
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, JSON.stringify([]));
                return [];
            }
            throw error;
        }
    }

    // Método para crear un nuevo carrito
    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: uuidv4(),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    // Método para obtener un carrito por su ID
    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        return cart;
    }

    // Método para agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        carts[cartIndex] = cart;
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}