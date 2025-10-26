const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta absoluta al archivo JSON
const cartsPath = path.join(__dirname, '../carts.json');


// Listar productos de un carrito

router.get('/:cid', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
    const { cid } = req.params;
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) return res.status(404).json({ mensaje: "Carrito no encontrado" });

    res.json(cart.products);
});


// Crear un carrito

router.post('/', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));

    const ids = carts.map(c => c.id);
    const maxId = carts.length > 0 ? Math.max(...ids) : 0;
    const newId = maxId + 1;

    const newCart = { id: newId, products: [] };

    carts.push(newCart);
    fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));

    res.status(201).json(newCart);
});


// Agregar productos al carrito

router.post('/:cid/product/:pid', (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
    const { cid, pid } = req.params;

    const cart = carts.find(c => c.id === parseInt(cid));
    if (!cart) return res.status(404).json({ mensaje: "Carrito no encontrado" });

    const existingProduct = cart.products.find(p => p.product === parseInt(pid));

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: parseInt(pid), quantity: 1 });
    }

    fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
    res.json(cart);
});


module.exports = router;