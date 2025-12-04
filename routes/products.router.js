import express from 'express';
import ProductModel from '../models/products.model.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const {
            limit = 5,
            page = 1,
            sort,
            query
        } = req.query;

        // FILTRO dinámico
        let filter = {};
        if (query) {
            // Si query es true o false, filtrar por status
            if (query === "true" || query === "false") {
                filter.status = query === "true";
            }
            // Caso contrario, filtrar por categoria
            else {
                filter.category = query;
            }
        }

        // ORDENAMIENTO por precio
        let sortOption = {};
        if (sort === "asc") sortOption.price = 1;
        if (sort === "desc") sortOption.price = -1;

        const result = await ProductModel.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true
        });

        return res.send({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}`
                : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: "error",
            error: "Error al obtener productos"
        });
    }
});


//Ruta GET para obtener un producto por ID
router.get('/:pid', async (req, res) => {
    const product = await ProductModel.findById(req.params.pid);
    // Si no lo encuentra, devolver 404
    if (!product) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    // Si lo encuentra, devolverlo
    res.json(product);
});

//Ruta POST para crear un nuevo Producto
router.post('/', async (req, res) => {
    const { title, description, code, price, category, thumbnails, stock } = req.body;

    // Validación mínima
    if (!title || !description || !code || !price || !category) {
        return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Crear en Mongo
    const newProduct = await ProductModel.create({
        title,
        description,
        code,
        price,
        category,
        stock: stock ?? 0,
        thumbnails: thumbnails ?? []
    });

    // Notificar en tiempo real
    req.app.get('io').emit("productAdded", newProduct);

    res.status(201).json({
        mensaje: "Producto creado",
        producto: newProduct
    });
});

// Ruta PUT para actualizar un producto EXISTENTE
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const updateProduct = await ProductModel.findById(pid);
        pid,
            req.body,
            { new: true } // Devuelve el producto actualizado

        if (!updateProduct) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({
            mensaje: "Producto actualizado con éxito",
            producto
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al actualizar producto",
            error: error.message
        });
    }
})

// Ruta DELETE para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    const deletedProduct = await ProductModel.findByIdAndDelete(pid);

    if (!deletedProduct) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Notificar en tiempo real
    req.app.get('io').emit("productDeleted", deletedProduct);

    res.json({
        mensaje: "Producto eliminado correctamente",
        producto: deletedProduct
    });
});

export default router;
