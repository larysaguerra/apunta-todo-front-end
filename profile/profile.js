// al iniciar la página, obtenemos el usuario actual , luego lo mostramos en los campos correspondientes
document.addEventListener('DOMContentLoaded', () => {

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const nombreUsuarioActual = JSON.parse(localStorage.getItem('nombreUsuarioActual'));

    if (!nombreUsuarioActual) {
        window.location.href = '../index.html';
        return;
    }

    const usuarioInfo = usuariosRegistrados.find(usuario => usuario.nombreUsuario === nombreUsuarioActual);

    if (usuarioInfo) {
        document.getElementById('nombreUsuario').value = usuarioInfo.nombreUsuario;
        document.getElementById('nombre').value = usuarioInfo.nombre;
        document.getElementById('apellido').value = usuarioInfo.apellido;
        document.getElementById('correo').value = usuarioInfo.correo;
        document.getElementById('telefono').value = usuarioInfo.telefono;
    }

});