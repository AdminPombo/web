document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('book-list');
    const orderForm = document.getElementById('order-form');
    const orderList = document.getElementById('order-list');
    let editMode = false;
    let editId = null;

    function getBooks() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }

    function saveBooks(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function renderBooks() {
        const books = getBooks();
        bookList.innerHTML = '';
        books.forEach((book, index) => {
            const bookItem = document.createElement('li');
            bookItem.innerHTML = `
                <div class="book-info">
                    <div>
                        <strong>${book.title}</strong> - ${book.author} (${book.year})<br>
                        <em>${book.publisher}</em><br>
                        Cantidad: ${book.quantity} ${book.outOfStock ? '<span class="out-of-stock">Agotado</span>' : ''}
                    </div>
                    <img src="${book.image}" alt="${book.title}" width="50" height="75">
                </div>
                <div class="actions">
                    <button class="edit-btn" data-id="${index}">Editar</button>
                    <button class="delete-btn" data-id="${index}">Eliminar</button>
                    <button class="out-of-stock-btn" data-id="${index}">${book.outOfStock ? 'Disponibilizar' : 'Agotar'}</button>
                </div>
            `;
            bookList.appendChild(bookItem);
        });
    }

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const publisher = document.getElementById('publisher').value;
        const quantity = document.getElementById('quantity').value;
        const image = document.getElementById('image').value;
        const outOfStock = document.getElementById('outOfStock').checked;
        const ubication = document.getElementById('ubication').value;
        const books = getBooks();

        if (editMode) {
            books[editId] = { title, author, year, publisher, quantity, image, outOfStock, ubication };
            editMode = false;
            editId = null;
        } else {
            books.push({ title, author, year, publisher, quantity, image, outOfStock, ubication });
        }

        saveBooks(books);
        renderBooks();
        bookForm.reset();
    });
    

    bookList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-id');
        const books = getBooks();

        if (e.target.classList.contains('delete-btn')) {
            books.splice(index, 1);
            saveBooks(books);
            renderBooks();
        }

        if (e.target.classList.contains('edit-btn')) {
            const book = books[index];
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('year').value = book.year;
            document.getElementById('publisher').value = book.publisher;
            document.getElementById('quantity').value = book.quantity;
            document.getElementById('image').value = book.image;
            document.getElementById('outOfStock').checked = book.outOfStock;
            document.getElementById('ubication').value = book.ubication;
            editMode = true;
            editId = index;
        }

        if (e.target.classList.contains('out-of-stock-btn')) {
            books[index].outOfStock = !books[index].outOfStock;
            saveBooks(books);
            renderBooks();
        }
    });

    function getOrders() {
        return JSON.parse(localStorage.getItem('orders')) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    function renderOrders() {
        const orders = getOrders();
        orderList.innerHTML = '';
        orders.forEach((order, index) => {
            const orderItem = document.createElement('li');
            orderItem.innerHTML = `
                <div class="order-info">
                    <div>
                        <strong>${order.books}</strong> - ${order.buyer} (${order.orderDate})<br>
                        Ciudad: ${order.city}, Tel: ${order.phone}<br>
                        Correo: ${order.school}, Estado: ${order.status}
                    </div>
                </div>
                <div class="actions">
                    <button class="edit-btn" data-id="${index}">Editar</button>
                    <button class="delete-btn" data-id="${index}">Eliminar</button>
                    <button class="status-btn" data-id="${index}">Cambiar Estado</button>
                </div>
            `;
            orderList.appendChild(orderItem);
        });
    }

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const books = document.getElementById('books').value;
        const buyer = document.getElementById('buyer').value;
        const orderDate = document.getElementById('orderDate').value;
        const city = document.getElementById('city').value;
        const phone = document.getElementById('phone').value;
        const school = document.getElementById('email').value;
        const status = document.getElementById('status').value;

        const orders = getOrders();

        if (editMode) {
            orders[editId] = { books, buyer, orderDate, city, phone, email, status };
            editMode = false;
            editId = null;
        } else {
            orders.push({ books, buyer, orderDate, city, phone, email, status });
        }

        saveOrders(orders);
        renderOrders();
        orderForm.reset();
    });

    orderList.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-id');
        const orders = getOrders();

        if (e.target.classList.contains('delete-btn')) {
            orders.splice(index, 1);
            saveOrders(orders);
            renderOrders();
        }

        if (e.target.classList.contains('edit-btn')) {
            const order = orders[index];
            document.getElementById('books').value = order.books;
            document.getElementById('buyer').value = order.buyer;
            document.getElementById('orderDate').value = order.orderDate;
            document.getElementById('city').value = order.city;
            document.getElementById('phone').value = order.phone;
            document.getElementById('email').value = order.email;
            document.getElementById('status').value = order.status;
            editMode = true;
            editId = index;
        }

        if (e.target.classList.contains('status-btn')) {
            const currentStatus = orders[index].status;
            const newStatus = currentStatus === 'pagado' ? 'procesado' : currentStatus === 'procesado' ? 'cancelado' : 'pagado';
            orders[index].status = newStatus;
            saveOrders(orders);
            renderOrders();
        }
    });

    renderBooks();
    renderOrders();
});
document.addEventListener('DOMContentLoaded', () => {
    // Función para filtrar libros
    document.getElementById('search-book').addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const books = document.querySelectorAll('#book-list li');

        books.forEach(function(book) {
            const title = book.querySelector('strong').textContent.toLowerCase();
            const author = book.querySelector('.book-info div').textContent.toLowerCase();
            const publisher = book.querySelector('em').textContent.toLowerCase();

            if (title.includes(filter) || author.includes(filter) || publisher.includes(filter)) {
                book.style.display = '';
            } else {
                book.style.display = 'none';
            }
        });
    });

    // Función para filtrar pedidos
    document.getElementById('search-order').addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const orders = document.querySelectorAll('#order-list li');

        orders.forEach(function(order) {
            const books = order.querySelector('strong').textContent.toLowerCase();
            const buyer = order.querySelector('.order-info div').textContent.toLowerCase();
            const city = order.querySelector('.order-info div').textContent.toLowerCase();
            const school = order.querySelector('.order-info div').textContent.toLowerCase();

            if (books.includes(filter) || buyer.includes(filter) || city.includes(filter) || school.includes(filter)) {
                order.style.display = '';
            } else {
                order.style.display = 'none';
            }
        });
    });
});
document.getElementById('download-excel').addEventListener('click', function() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    // Crea un array de arrays donde cada array interno es una fila en Excel
    const bookData = books.map(book => [
        book.title,
        book.author,
        book.year,
        book.publisher,
        book.quantity,
        book.outOfStock ? 'Agotado' : 'Disponible',
        book.ubication
    ]);

    // Agrega una fila de encabezado al inicio
    bookData.unshift(['Título', 'Autor', 'Año', 'Editorial', 'Cantidad', 'Estado', 'Ubicación']);

    // Crea una hoja de trabajo (worksheet)
    const ws = XLSX.utils.aoa_to_sheet(bookData);

    // Crea un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario de Libros');

    // Genera el archivo Excel y lo descarga
    XLSX.writeFile(wb, 'inventario_libros.xlsx');
});

