const socket = io();

// --- Listeners de Sockets ---
// Escuchamos el evento 'updateProducts' que envía el servidor
socket.on('updateProducts', (products) => {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; // Limpiamos la lista

    // Creamos la nueva lista de productos
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            ID: ${product.id} <br>
            <strong>${product.title}</strong> - $${product.price}
        `;
        productsList.appendChild(li);
    });
});


// --- Emitters de Sockets desde el Cliente ---
// Formulario para agregar productos
const addForm = document.getElementById('add-product-form');
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);
    const newProduct = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
        status: true
    };
    
    // Usamos la API para crear el producto, que a su vez emitirá el evento de socket
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    }).then(() => {
        addForm.reset();
    });
});

// Formulario para eliminar productos
const deleteForm = document.getElementById('delete-product-form');
deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = new FormData(deleteForm).get('id');
    
    // Usamos la API para eliminar, que a su vez emitirá el evento de socket
    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
    }).then(() => {
        deleteForm.reset();
    });
});