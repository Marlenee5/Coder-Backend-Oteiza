const socket = io();
const list = document.getElementById('productsList');

// Cuando se envía la lista completa (al entrar a la página)
socket.on('updateProducts', (products) => {
    render(products);
});

// Cuando se agrega un producto
socket.on('productAdded', (product) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${product.title}</strong> - $${product.price}`;
    list.appendChild(li);
});

// Cuando se elimina
socket.on('productDeleted', (product) => {
    const items = list.querySelectorAll('li');
    items.forEach(item => {
        if (item.textContent.includes(product.title)) {
            item.remove();
        }
    });
});

function render(products) {
    list.innerHTML = '';
    products.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`;
        list.appendChild(li);
    });
}