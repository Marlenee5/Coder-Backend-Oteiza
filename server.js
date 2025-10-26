const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

// Middleware para poder trabajar con datos JSON
app.use(express.json());
app.use('/api/carts', cartsRouter);

// Montar el router de productos bajo /api/products
app.use('/api/products', productsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
