
import { Usuario } from "../models/usuario.js";

const boton = document.getElementById("btnRegistro");

boton.addEventListener("click", function () {

    // Obtener los usuarios existentes del localStorage o inicializar un array vacío
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const nombreUsuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    const mensaje = document.getElementById("mensaje");

    if (nombre === "" || apellido === "" || correo === "" || telefono === "" || nombreUsuario === "" || password === "" || confirmarPassword === "") {
        mensaje.textContent = "Todos los campos son obligatorios";
        return;
    }
    if (correo.indexOf("@") === -1) {
        mensaje.textContent = "Correo inválido";
        return;
    }
    if (usuarios.some(u => u.correo === correo)) {
        mensaje.textContent = "El correo ya está en uso";
        return;
    }
    if (usuarios.some(u => u.nombreUsuario === nombreUsuario)) {
        mensaje.textContent = "El nombre de usuario ya está en uso";
        return;
    }
    if (isNaN(telefono)) {
        mensaje.textContent = "El teléfono debe ser numérico";
        return;
    }
    if (password !== confirmarPassword) {
        mensaje.textContent = "Las contraseñas no coinciden";
        return;
    }

    // Crear un nuevo usuario y guardarlo en el localStorage
    const nuevoUsuario = new Usuario(
        nombre,
        apellido,
        correo,
        telefono,
        nombreUsuario,
        password,
        "usuario" // rol por defecto
    );

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mensaje.textContent = "Registro exitoso";

    console.log(usuarios);

    // Ir a la página de inicio de sesión después de un breve retraso
    window.location.href = "../login/login.html";

});