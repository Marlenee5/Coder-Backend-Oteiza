import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
// import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

const app = express();
const PORT = 8080;

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Multer configuración
// const storageConfig = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storageConfig });

// Routers API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Router de vistas
app.use("/", viewsRouter);

// Servidor HTTP + Socket.io
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);
app.set('io', io);

// Socket.io server
io.on("connection", async (socket) => {
  console.log("Cliente conectado por WebSocket");

  try {
    const productsPath = path.join(__dirname, 'products.json');
    const data = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(data);

    // Enviar lista completa al cliente al conectar
    socket.emit('updateProducts', products);
  } catch (error) {
    console.error("Error al leer products.json:", error);
  }
});

// Exportar io para usarlo en products.router
export { io };

// Post para MULTER y subida de archivos
// app.post('/upload', upload.single('file'), (req, res) => {
//   res.send('Archivo se ha subido correctamente')
// })

//https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.1/socket.io.min.js//