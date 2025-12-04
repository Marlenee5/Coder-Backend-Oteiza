import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

// Schema

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
});

// Activar paginación
productSchema.plugin(mongoosePaginate);

// Modelo
export const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;