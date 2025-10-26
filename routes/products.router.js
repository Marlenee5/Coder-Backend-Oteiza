const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta absoluta al archivo JSON
const productsPath = path.join(__dirname, '../products.json');

// Array de productos cargado desde el archivo JSON
let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));


//Ruta GET para traer todos los productos
router.get('/:pid', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const { pid } = req.params;
    // Buscamos el producto en el array
    const producto = products.find(p => p.id === parseInt(pid));
    // Si no lo encuentra, devolver 404
    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    // Si lo encuentra, devolverlo
    res.json(producto);
});

//Ruta POST para crear un nuevo Producto
router.post('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const { title, description, code, price } = req.body

    const ids = products.map(p => p.id);
    const maxId = products.length > 0 ? Math.max(...ids) : 0;
    const newId = maxId + 1 || 1;

    if (!title || !description || !code || !price) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        status: true, // si querés un valor por defecto
        stock: 0,     // por defecto|
        category: '',
        thumbnails: []
    };


    products.push(newProduct)
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct)
})

// Ruta PUT para actualizar un producto EXISTENTE
router.put('/:pid', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const { pid } = req.params;
    const producto = products.find(p => p.id === parseInt(pid));

    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    //Actualizar campos (los del body)
    const { title, description, code, price, stock } = req.body;

    producto.title = title || producto.title;
    producto.description = description || producto.description;
    producto.code = code || producto.code;
    producto.price = price || producto.price;
    producto.stock = stock || producto.stock;

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.json({
        mensaje: "Producto actualizado con éxito",
        producto
    });
})

// Ruta DELETE para eliminar un producto
router.delete('/:pid', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const { pid } = req.params;
    const index = products.findIndex(p => p.id === parseInt(pid));

    if (index === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    //Eliminar el producto del Array
    const deletedProduct = products.splice(index, 1);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    res.json({ mensaje: "Producto eliinado correctamente", producto: deletedProduct });
});


module.exports = router;