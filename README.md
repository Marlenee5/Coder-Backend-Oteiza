🛒 API Backend - Productos & Carritos

Proyecto de Backend creado con Node.js + Express + MongoDB (Mongoose).
Implementa una API REST para gestionar:

✔️ Productos

✔️ Carritos de compra

✔️ Persistencia en MongoDB

✔️ Manejo de errores global

✔️ Ruteo modular con Express Router

🚀 Instalación
git clone https://github.com/Marlenee5/Coder-Backend-Oteiza
cd Coder-Backend-Oteiza

📂 Endpoints principales
🧩 Productos
Método	Endpoint	Descripción
GET	/api/products	Lista todos los productos
GET	/api/products/:pid	Obtiene un producto por ID
POST	/api/products	Crea un producto
PUT	/api/products/:pid	Actualiza un producto
DELETE	/api/products/:pid	Elimina un producto
🛒 Carritos
Método	Endpoint	Descripción
POST	/api/carts	Crea un carrito
GET	/api/carts/:cid	Obtiene un carrito con populate
POST	/api/carts/:cid/product/:pid	Agrega un producto al carrito
PUT	/api/carts/:cid	Reemplaza el array completo de productos
PUT	/api/carts/:cid/product/:pid	Actualiza cantidad de un producto
DELETE	/api/carts/:cid/product/:pid	Elimina un producto del carrito
DELETE	/api/carts/:cid	Vacía completamente el carrito


🧪 Pruebas recomendadas (Postman)

Crear un producto
POST /api/products

Crear un carrito
POST /api/carts

Agregar un producto al carrito
POST /api/carts/:cid/product/:pid

Ver carrito con productos poblados
GET /api/carts/:cid

Actualizar cantidad
PUT /api/carts/:cid/product/:pid

🧱 Tecnologías usadas

Node.js

Express

Mongoose

Nodemon
