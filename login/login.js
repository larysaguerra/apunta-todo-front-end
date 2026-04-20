// Generar fucnion para iniciar sesion solo con el correo y contraseña
console.log("Iniciando sesión...");
const boton = document.getElementById("btnLogin");

console.log(boton);

boton.addEventListener("click", function () {

    console.log("Botón de inicio de sesión clickeado");

    // Obtener los usuarios existentes del localStorage o inicializar un array vacío
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Obtener los valores del correo y contraseña
    var correo = document.getElementById("correo").value;
    var contrasena = document.getElementById("contrasena").value;

    // Validar que el correo o nombre de usuario no esté vacío
    if (correo === "") {
        alert("Por favor, ingrese su correo o nombre de usuario");
        return;
    }

    // Validar que la contraseña no estén vacíos
    if (contrasena === "") {
        alert("Por favor, ingrese su contraseña");
        return;
    }

    // Validar el correo o nombre de usuario existe
    var usuarioEncontrado = usuarios.find(function (usuario) {
        return usuario.correo === correo || usuario.nombreUsuario === correo;
    });

    if (!usuarioEncontrado) {
        alert("Correo o nombre de usuario no encontrado");
        return;
    }

    // Validar la contraseña
    if (usuarioEncontrado.password !== contrasena) {
        alert("Contraseña incorrecta");
        return;
    }
    // Simular una autenticación exitosa
    alert("Inicio de sesión exitoso");

    // Guardar el usuario autenticado en el localStorage
    localStorage.setItem("nombreUsuarioActual", JSON.stringify(usuarioEncontrado.nombreUsuario));

    // Redirigir al usuario a la página de lista de tareas
    window.location.href = "../list/list.html";

});

// RECUPERAR USUARIO

const recuperar = document.getElementById("recuperarUsuario");

console.log(recuperar);

if (recuperar) {
    recuperar.addEventListener("click", function () {

        console.log("Recuperar usuario");

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        let correo = document.getElementById("correo").value;

        if (correo === "") {
            alert("Ingresa tu correo para recuperar tu usuario");
            return;
        }

        let usuarioEncontrado = usuarios.find(u => u.correo === correo);

        if (usuarioEncontrado) {
            alert("Tu usuario es: " + usuarioEncontrado.nombreUsuario + "\nTu contraseña es: " + usuarioEncontrado.password);
        } else {
            alert("Usuario no encontrado");
        }

    });
}