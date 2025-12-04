import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

// Models
import ProductModel from './models/products.model.js';

const app = express();
const PORT = 8080;

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// *** Middleware ***
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/backend1")
  .then(() => console.log("🚀 Conectado a MongoDB"))
  .catch(err => console.log("Error al conectar Mongo:", err));

// Middleware Global de Errores
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err);
  res.status(500).send('Error interno del servidor');
});

// Servidor HTTP + WebSocket 
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);
app.set('io', io);

//  WebSocket Events 
io.on("connection", async (socket) => {
  console.log("Cliente conectado por WebSocket");

  // Enviar productos actuales
  const products = await ProductModel.find().lean();
  socket.emit("updateProducts", products);

  // ESCUCHAR creación de nuevo producto desde el cliente
  socket.on("newProduct", async (data) => {
    const newProd = await ProductModel.create(data);

    // Enviar lista actualizada a todos
    const updated = await ProductModel.find().lean();
    io.emit("updateProducts", updated);
  });
});


export { io };
