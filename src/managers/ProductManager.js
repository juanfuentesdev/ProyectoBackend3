import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid'; // Usaremos UUID para generar IDs únicos

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Método para leer los productos del archivo
    async getProducts() {
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

    // Método para agregar un nuevo producto
    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { id: uuidv4(), ...product };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // Método para obtener un producto por su ID
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        return product;
    }

    // Método para actualizar un producto
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) return null;
        const updatedProduct = { ...products[productIndex], ...updatedFields, id: products[productIndex].id };
        products[productIndex] = updatedProduct;
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return updatedProduct;
    }

    // Método para eliminar un producto
    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);
        if (products.length === initialLength) return false;
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return true;
    }
}