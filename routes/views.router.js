import { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al JSON
const productsPath = path.join(__dirname, '../products.json');

// home → muestra lista estática
router.get('/home', async (req, res) => {
    const data = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(data);

    res.render('home', { products });
});

// realtimeproducts → se actualiza en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    const data = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(data);

    res.render("realTimeProducts", {
        title: "Productos en tiempo real",
        products
    });
});



export default router;
