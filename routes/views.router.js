import { Router } from 'express';
import { ProductModel } from '../models/products.model.js';

const router = Router();

// home → muestra lista estática
router.get('/home', async (req, res) => {
    const products = await ProductModel.find().lean(); //.lean() para que handlebars lo pueda leer

    res.render('home', { products });
});

// realtimeproducts → se actualiza en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const products = await ProductModel.find().lean();

    res.render("realTimeProducts", {
        title: "Productos en tiempo real",
        products
    });
});



export default router;
