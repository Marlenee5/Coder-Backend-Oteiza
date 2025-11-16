import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router();

// Ruta absoluta al archivo JSON
const productsPath = path.join(__dirname, '../products.json');

// Funciones auxiliares
const readProducts = async () => {
    const data = await fs.readFile(productsPath, 'utf-8')
    return JSON.parse(data);
};

const writeProducts = async (products) => {
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
};

// Ruta GET para listar los productos
router.get('/', async (req, res) => {
    try {
        const products = await readProducts();

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer los productos', error: error.message });
    }
});

//Ruta GET para obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const products = await readProducts();

        const { pid } = req.params;
        // Buscamos el producto en el array
        const producto = products.find(p => p.id === parseInt(pid));
        // Si no lo encuentra, devolver 404
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        // Si lo encuentra, devolverlo
        res.json(producto);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al leer el archivo', error: error.message })
    }
});

//Ruta POST para crear un nuevo Producto
router.post('/', async (req, res) => {
    try {
        const products = await readProducts();
        const { title, description, code, price, category, thumbnails } = req.body;

        if (!title || !description || !code || !price) {
            return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
        }

        const ids = products.map(p => p.id);
        const maxId = ids.length ? Math.max(...ids) : 0;

        const newProduct = {
            id: maxId + 1,
            title,
            description,
            code,
            price,
            status: true, // si querés un valor por defecto
            stock: 0,     // por defecto|
            category: category ?? '',
            thumbnails: thumbnails ?? []
        };

        products.push(newProduct)
        await writeProducts(products);

        //Notificar a los clientes en tiempo real
        req.app.get('io').emit("productAdded", newProduct);

        res.status(201).json(newProduct)

    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar el producto', error: error.message });
    }
});

// Ruta PUT para actualizar un producto EXISTENTE
router.put('/:pid', async (req, res) => {
    try {
        const products = await readProducts();
        const { pid } = req.params;

        const producto = products.find(p => p.id === parseInt(pid));

        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        //Actualizar campos (los del body)
        const { title, description, code, price, stock } = req.body;

        producto.title = title ?? producto.title;
        producto.description = description ?? producto.description;
        producto.code = code ?? producto.code;
        producto.price = price ?? producto.price;
        producto.stock = stock ?? producto.stock;

        await writeProducts(products);
        res.json({
            mensaje: "Producto actualizado con éxito",
            producto
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar el producto', error: error.message });
    }
})

// Ruta DELETE para eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const products = await readProducts();
        const { pid } = req.params;

        const index = products.findIndex(p => p.id === parseInt(pid));

        if (index === -1) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        //Eliminar el producto del Array
        const deletedProduct = products.splice(index, 1);
        await writeProducts(products);

        //Notificar a los clientes en tiempo real
        req.app.get('io').emit("productDeleted", deletedProduct[0]);

        res.json({
            mensaje: "Producto eliminado correctamente",
            producto: deletedProduct
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el producto',
            error: error.message
        });
    }
});


export default router;
