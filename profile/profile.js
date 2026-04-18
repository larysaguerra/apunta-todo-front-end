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
        document.getElementById('nombreUsuario').textContent = usuarioInfo.nombreUsuario;
        document.getElementById('nombre').textContent = `Nombre: ${usuarioInfo.nombre}`;
        document.getElementById('apellido').textContent = `Apellido: ${usuarioInfo.apellido}`;
        document.getElementById('correo').textContent = `Correo: ${usuarioInfo.correo}`;
        document.getElementById('telefono').textContent = `Teléfono: ${usuarioInfo.telefono}`;
        document.getElementById('password').textContent = `Contraseña: ${'*'.repeat(usuarioInfo.password.length)}`;
    }

});