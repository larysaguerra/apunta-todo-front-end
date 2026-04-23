// Cargar usuarios al iniciar
document.addEventListener("DOMContentLoaded", function () {
    mostrarUsuarios();
});

// MOSTRAR USUARIOS
function mostrarUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let tabla = document.getElementById("tablaUsuarios");

    tabla.innerHTML = "";

    usuarios.forEach((u, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.correo}</td>
                <td>${u.nombreUsuario}</td>
                <td>${u.rol}</td>
                <td>
                    <button onclick="editarUsuario(${index})">✏️</button>
                    <button onclick="eliminarUsuario(${index})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// CREAR USUARIO
document.getElementById("btnNuevo").addEventListener("click", function () {

    let nombre = prompt("Nombre:");
    let apellido = prompt("Apellido:");
    let correo = prompt("Correo:");
    let nombreUsuario = prompt("Usuario:");
    let password = prompt("Contraseña:");

    if (!nombre || !apellido || !correo || !nombreUsuario || !password) {
        alert("Todos los campos son obligatorios");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({
        id: Date.now(),
        nombre,
        apellido,
        correo,
        telefono: "",
        nombreUsuario,
        password,
        rol: "usuario"
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarUsuarios();
});

// EDITAR USUARIO
function editarUsuario(index) {

    let usuarios = JSON.parse(localStorage.getItem("usuarios"));

    let nuevoNombre = prompt("Nuevo nombre:", usuarios[index].nombre);
    let nuevoApellido = prompt("Nuevo apellido:", usuarios[index].apellido);

    if (nuevoNombre && nuevoApellido) {
        usuarios[index].nombre = nuevoNombre;
        usuarios[index].apellido = nuevoApellido;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarUsuarios();
    }
}

// ELIMINAR USUARIO
function eliminarUsuario(index) {

    let usuarios = JSON.parse(localStorage.getItem("usuarios"));

    if (confirm("¿Eliminar usuario?")) {
        usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarUsuarios();
    }
}