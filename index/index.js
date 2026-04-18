// limpiar el user autenticado al cargar la página de inicio

window.addEventListener("load", function() {
    localStorage.removeItem("nombreUsuarioActual");
});