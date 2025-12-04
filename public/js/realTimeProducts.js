const socket = io();

const form = document.getElementById("productForm");
const list = document.getElementById("productsList");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: Number(form.price.value),
        stock: Number(form.stock.value),
        category: form.category.value,
        thumbnails: form.thumbnails.value ? [form.thumbnails.value] : []
    };

    socket.emit("newProduct", data);

    form.reset();
});

// Recibir lista actualizada desde el servidor
socket.on("updateProducts", (products) => {
    list.innerHTML = "";

    products.forEach(p => {
        list.innerHTML += `
            <li>
                <strong>${p.title}</strong> - $${p.price} <br>
                ${p.description} <br>
                Código: ${p.code} | Stock: ${p.stock} | Categoría: ${p.category}
            </li>
        `;
    });
});
