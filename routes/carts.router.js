import express from 'express';
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/products.model.js";

const router = express.Router();


// GET: obtener productos de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await CartModel.findById(cid).populate("products.product");

        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener carrito" });
    }
});

// POST: Crear un carrito
router.post('/', async (req, res) => {

    const newCart = await CartModel.create({ products: [] });
    res.status(201).json(newCart);
});

// POST: Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    // Validar que el carrito exista
    const cart = await CartModel.findById(cid);
    if (!cart) {
        return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    // Validar que el producto exista
    const productExists = await ProductModel.findById(pid);
    if (!productExists) {
        return res.status(404).json({ mensaje: "Producto no existe" });
    }

    // Buscar si ya existe el producto en el carrito
    const productInCart = cart.products.find(p => p.product.toString() === pid);

    if (productInCart) {
        // Si existe, aumentar la cantidad
        productInCart.quantity += 1;
    } else {
        // Si no existe, agregarlo al carrito
        cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.json({
        mensaje: "Producto agregado al carrito",
        carrito: cart
    });
});


// Actualizar el carrito con un array de productos
router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const newProducts = req.body;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        cart.products = newProducts;

        await cart.save();

        res.send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: "Error al actualizar carrito" });
    }
});

// Actualizar solo la cantidad del producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Validación para que la cantidad sea un número y mayor que 0
        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).send({ error: "Cantidad inválida" });
        }

        // Validación para que el carrito exista
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        // Validación para que el producto exista
        const product = cart.products.find(p => p.product.toString() === pid);
        if (!product) return res.status(404).send({ error: "Producto no encontrado" });

        product.quantity = quantity;

        await cart.save();

        res.send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: "Error al actualizar cantidad" });
    }
});



// Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        await cart.save();

        res.send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar producto" });
    }
});


// Vaciar el carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });

        cart.products = [];

        await cart.save();

        res.send({ status: "success", cart });
    } catch (error) {
        res.status(500).send({ error: "Error al vaciar carrito" });
    }
});

export default router;
