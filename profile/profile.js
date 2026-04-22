// al iniciar la página, obtenemos el usuario actual , luego lo mostramos en los campos correspondientes
document.addEventListener('DOMContentLoaded', () => {

    // MOSTRAR NOMBRE EN EL HEADER
    const nombreUsuarioActual = JSON.parse(localStorage.getItem("nombreUsuarioActual"));

    if (nombreUsuarioActual) {
        document.getElementById("nombreHeader").textContent = nombreUsuarioActual;
    }

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const nombreUsuarioActual2 = JSON.parse(localStorage.getItem('nombreUsuarioActual'));

    if (!nombreUsuarioActual2) {
        window.location.href = '../index/index.html';
        return;
    }

    const usuarioInfo = usuariosRegistrados.find(usuario => usuario.nombreUsuario === nombreUsuarioActual2);

    if (usuarioInfo) {
        document.getElementById('nombreUsuario').value = usuarioInfo.nombreUsuario;
        document.getElementById('nombre').value = usuarioInfo.nombre;
        document.getElementById('apellido').value = usuarioInfo.apellido;
        document.getElementById('correo').value = usuarioInfo.correo;
        document.getElementById('telefono').value = usuarioInfo.telefono;
    }

    // BOTÓN CANCELAR (AGREGADO AQUÍ)
    const btnCancelar = document.getElementById("btnCancelar");

    btnCancelar.addEventListener("click", function () {
        location.reload();
    });

});


// GUARDAR CAMBIOS DEL PERFIL
const botonGuardar = document.getElementById("btnGuardarPerfil");

botonGuardar.addEventListener("click", function () {

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let nombreUsuarioActual = JSON.parse(localStorage.getItem("nombreUsuarioActual"));

    let usuarioIndex = usuarios.findIndex(u => u.nombreUsuario === nombreUsuarioActual);

    if (usuarioIndex === -1) {
        alert("Usuario no encontrado");
        return;
    }

    usuarios[usuarioIndex].nombre = document.getElementById("nombre").value;
    usuarios[usuarioIndex].apellido = document.getElementById("apellido").value;
    usuarios[usuarioIndex].correo = document.getElementById("correo").value;
    usuarios[usuarioIndex].telefono = document.getElementById("telefono").value;

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Datos actualizados correctamente");
});


// CAMBIAR CONTRASEÑA
const botonClave = document.getElementById("btnGuardarContrasena");

botonClave.addEventListener("click", function () {

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let nombreUsuarioActual = JSON.parse(localStorage.getItem("nombreUsuarioActual"));

    let usuarioIndex = usuarios.findIndex(u => u.nombreUsuario === nombreUsuarioActual);

    if (usuarioIndex === -1) return;

    let claveActual = document.getElementById("claveActual").value;
    let nuevaClave = document.getElementById("nuevaClave").value;
    let confirmarClave = document.getElementById("confirmarClave").value;

    // Si no llenó campos, no valida contraseña
    if (!claveActual && !nuevaClave && !confirmarClave) return;

    if (usuarios[usuarioIndex].password !== claveActual) {
        alert("La contraseña actual es incorrecta");
        return;
    }

    if (!nuevaClave) {
        alert("La nueva contraseña no puede estar vacía");
        return;
    }

    if (nuevaClave === claveActual) {
        alert("La nueva contraseña no puede ser igual a la actual");
        return;
    }
    
    if (!confirmarClave) {
        alert("Por favor, confirma la nueva contraseña");
        return;
    }

    if (nuevaClave !== confirmarClave) {
        alert("Las nuevas contraseñas no coinciden");
        return;
    }

    usuarios[usuarioIndex].password = nuevaClave;

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Contraseña actualizada correctamente");
});


// CERRAR SESIÓN
const btnCerrar = document.getElementById("btnCerrarSesion");

btnCerrar.addEventListener("click", function () {
    localStorage.removeItem("nombreUsuarioActual");
    window.location.href = "../login/login.html";
});