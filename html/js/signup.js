
let usuarios = [];


const boton = document.getElementById("btnRegistro");


boton.addEventListener("click", function () {

    
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    
    const mensaje = document.getElementById("mensaje");

    
    if (nombre === "" || apellido === "" || correo === "" || telefono === "" || usuario === "" || password === "" || confirmarPassword === "") {
        mensaje.textContent = "Todos los campos son obligatorios";
    } 
    else if (correo.indexOf("@") === -1) {
        mensaje.textContent = "Correo inválido";
    } 
    else if (isNaN(telefono)) {
        mensaje.textContent = "El teléfono debe ser numérico";
    } 
    else if (password !== confirmarPassword) {
        mensaje.textContent = "Las contraseñas no coinciden";
    } 
    else {

        
        const usuarioNuevo = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono,
            usuario: usuario,
            password: password
        };

        
        usuarios.push(usuarioNuevo);

        
        mensaje.textContent = "Registro exitoso";

        
        console.log(usuarios);

        
    }

});