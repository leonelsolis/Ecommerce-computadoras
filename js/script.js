
const productos = [
    { id: 1, nombre: "Computadora gamer", precio: 1800000, imagen: "./img/pc-gamer.jpg" },
    { id: 2, nombre: "Computadora de oficina", precio: 750000, imagen: "./img/pc-oficina.jpg" },
    { id: 3, nombre: "Computadora para diseño grafico", precio: 1500000, imagen: "./img/pc-diseño.jpg" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarProductos(filtroMin = 0, filtroMax = Infinity) {
    const contenedorProductos = document.querySelector(".lista-productos");
    contenedorProductos.innerHTML = "";

    const productosFiltrados = productos.filter(producto => producto.precio >= filtroMin && producto.precio <= filtroMax);

    productosFiltrados.forEach(producto => {
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;

        const h3 = document.createElement("h3");
        h3.textContent = producto.nombre;

        const p = document.createElement("p");
        p.textContent = `Precio: $${producto.precio}`;

        const botonAgregar = document.createElement("button");
        botonAgregar.textContent = "Agregar al Carrito";
        botonAgregar.dataset.id = producto.id;
        botonAgregar.addEventListener("click", agregarAlCarrito);

        divProducto.appendChild(imagen);
        divProducto.appendChild(h3);
        divProducto.appendChild(p);
        divProducto.appendChild(botonAgregar);

        contenedorProductos.appendChild(divProducto);
    });
}

function agregarAlCarrito(evento) {
    const idProducto = parseInt(evento.target.dataset.id);
    const producto = productos.find(producto => producto.id === idProducto);

    if (producto) {
        const productoEnCarrito = carrito.find(productoCarrito => productoCarrito.id === idProducto);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        guardarCarritoEnLocalStorage();
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const tablaCarrito = document.querySelector("#tablaCarrito tbody");
    tablaCarrito.innerHTML = "";

    carrito.forEach(productoCarrito => {
        const fila = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = productoCarrito.nombre;

        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = `$${productoCarrito.precio}`;

        const tdCantidad = document.createElement("td");
        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = "1";
        inputCantidad.value = productoCarrito.cantidad;
        inputCantidad.addEventListener("change", actualizarCantidadEnCarrito);
        inputCantidad.dataset.id = productoCarrito.id;
        tdCantidad.appendChild(inputCantidad);

        const tdSubtotal = document.createElement("td");
        tdSubtotal.textContent = `$${productoCarrito.precio * productoCarrito.cantidad}`;

        const tdRemover = document.createElement("td");
        const botonRemover = document.createElement("button");
        botonRemover.textContent = "X";
        botonRemover.addEventListener("click", removerDelCarrito);
        botonRemover.dataset.id = productoCarrito.id;
        tdRemover.appendChild(botonRemover);

        fila.appendChild(tdNombre);
        fila.appendChild(tdPrecio);
        fila.appendChild(tdCantidad);
        fila.appendChild(tdSubtotal);
        fila.appendChild(tdRemover);

        tablaCarrito.appendChild(fila);
    });

    calcularTotal();
}

function actualizarCantidadEnCarrito(evento) {
    const idProducto = parseInt(evento.target.dataset.id);
    const nuevaCantidad = parseInt(evento.target.value);

    const productoEnCarrito = carrito.find(productoCarrito => productoCarrito.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad = nuevaCantidad;
        guardarCarritoEnLocalStorage();
        actualizarCarrito();
    }
}

function calcularTotal() {
    let total = 0;
    carrito.forEach(productoCarrito => {
        total += productoCarrito.precio * productoCarrito.cantidad;
    });

    const totalElement = document.getElementById("total");
    totalElement.textContent = `$${total}`;
}

function removerDelCarrito(evento) {
    const idProducto = parseInt(evento.target.dataset.id);

    carrito = carrito.filter(productoCarrito => productoCarrito.id !== idProducto);
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    alert("¡Gracias por su compra! Su pedido será procesado en breve.");
    vaciarCarrito();
}

function aplicarFiltro() {
    const filtroMin = parseInt(document.getElementById("filtroPrecioMin").value) || 0;
    const filtroMax = parseInt(document.getElementById("filtroPrecioMax").value) || Infinity;
    mostrarProductos(filtroMin, filtroMax);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("vaciarCarrito").addEventListener("click", vaciarCarrito);
    document.getElementById("finalizarCompra").addEventListener("click", finalizarCompra);
    document.getElementById("aplicarFiltro").addEventListener("click", aplicarFiltro);

    mostrarProductos(); 
    actualizarCarrito(); 
});
