// Generar fucnion para iniciar sesion solo con el correo y contraseña
function login() {

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
    
    // Simular una autenticación exitosa
    alert("Inicio de sesión exitoso");

    // Redirigir al usuario a la página de lista de tareas
    window.location.href = "list.html";

}