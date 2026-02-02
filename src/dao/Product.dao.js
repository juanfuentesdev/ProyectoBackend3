import { ProductModel } from '../models/Product.model.js';

export class ProductDAO {
async getAll({ limit = 10, page = 1, sort, query, availability }) {
    const filter = {};
    if (query) {
        filter.category = query;
    }
    if (availability) {
        // Filtra productos donde el stock sea mayor a 0
        filter.stock = { $gt: 0 };
    }

    const options = {
        page,
        limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        lean: true
    };
    const result = await ProductModel.paginate(filter, options);
    return result;
}

    async getById(id) {
        return await ProductModel.findById(id).lean();
    }

    async create(productData) {
        return await ProductModel.create(productData);
    }

    async update(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}