
const boton = document.getElementById("btnLogin");

boton.addEventListener("click", function () {

     
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

   
    var correo = document.getElementById("correo").value;
    var contrasena = document.getElementById("contrasena").value;
    
    
    if (correo === "") {
        alert("Por favor, ingrese su correo o nombre de usuario");
        return;
    }
    
    
    if (contrasena === "") {
        alert("Por favor, ingrese su contraseña");
        return;
    }

    
    var usuarioEncontrado = usuarios.find(function(usuario) {
        return usuario.correo === correo || usuario.nombreUsuario === correo;
    });

    if (!usuarioEncontrado) {
        alert("Correo o nombre de usuario no encontrado");
        return;
    }

    
    if (usuarioEncontrado.password !== contrasena) {
        alert("Contraseña incorrecta");
        return;
    }

    
    alert("Inicio de sesión exitoso");

    
    window.location.href = "list.html";

});

const recuperar = document.getElementById("recuperarUsuario");

recuperar.addEventListener("click", function () {

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let correo = document.getElementById("correo").value;

    if (correo === "") {
        alert("Por favor, ingrese su correo para recuperar su información");
        return;
    }

    let usuarioEncontrado = usuarios.find(u => u.correo === correo);

    if (!usuarioEncontrado) {
        alert("No existe una cuenta con ese correo");
        return;
    }

    alert(
        "Recuperación de cuenta (simulación):\n\n" +
        "Usuario: " + usuarioEncontrado.nombreUsuario + "\n" +
        "Contraseña: " + usuarioEncontrado.password
    );

});