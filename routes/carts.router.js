import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = express.Router();

// Necesario para que __dirname funcione con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al archivo JSON
const cartsPath = path.join(__dirname, '../carts.json');

// Ruta absoluta al archivo de productos
const productsPath = path.join(__dirname, '../products.json');

// Leer productos
const readProducts = async () => {
    const data = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(data);
};

// Función para leer carritos
const readCarts = async () => {
    const data = await fs.readFile(cartsPath, 'utf-8');
    return JSON.parse(data);
};

// Función para escribir carritos
const writeCarts = async (carts) => {
    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
};

// GET: Productos de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const carts = await readCarts();
        const { cid } = req.params;

        const cart = carts.find(c => c.id === parseInt(cid));

        if (!cart) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" });
        }

        res.json(cart.products);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al leer el archivo',
            error: error.message
        });
    }
});

// POST: Crear un carrito
router.post('/', async (req, res) => {
    try {
        const carts = await readCarts();

        const ids = carts.map(c => c.id);
        const maxId = carts.length > 0 ? Math.max(...ids) : 0;

        const newCart = { id: maxId + 1, products: [] };

        carts.push(newCart);
        await writeCarts(carts);

        res.status(201).json(newCart);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al escribir el archivo',
            error: error.message
        });
    }
});

// POST: Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await readCarts();
        const { cid, pid } = req.params;

        const cartId = parseInt(cid);
        const productId = parseInt(pid);

        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" });
        }

        // VALIDAR QUE EL PRODUCTO EXISTA
        const products = await readProducts();
        const productExists = products.find(p => p.id === parseInt(pid));

        if (!productExists) {
            return res.status(404).json({ mensaje: "Producto no existe" });
        }

        // Si existe, seguimos
        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await writeCarts(carts);

        res.json(cart);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al escribir archivo',
            error: error.message
        });
    }
});

export default router;
