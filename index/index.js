import { Usuario } from "../models/usuario.js";

crearAdmin();
crearUsuarios();

function crearAdmin() {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const adminYettyExistente = usuarios.some(u => u.nombreUsuario === "YettyAdmin");
    if (!adminYettyExistente) {
        const admin = new Usuario(
            "Yetty",
            "Sanz",
            "yetty@admin.com",
            "3123123132123",
            "YettyAdmin",
            "1234",
            "admin"
        );
        usuarios.push(admin);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    const adminLaryExistente = usuarios.some(u => u.nombreUsuario === "LaryAdmin");
    if (!adminLaryExistente) {
        const admin = new Usuario(
            "Lary",
            "Guerra",
            "lary@admin.com",
            "3123123132123",
            "LaryAdmin",
            "1234",
            "admin"
        );
        usuarios.push(admin);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

function crearUsuarios() {

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario1 = new Usuario("Ana", "Perez", "ana@correo.com", "123", "ana123", "1234");
    const usuario2 = new Usuario("Luis", "Gomez", "luis@correo.com", "456", "luis123", "1234");
    const usuario3 = new Usuario("Sofia", "Ramirez", "sofia@correo.com", "789", "sofia123", "1234");
    const usuario4 = new Usuario("Carlos", "Diaz", "carlos@correo.com", "000", "carlos123", "1234");

    // Agregar todos
    usuarios.push(usuario1, usuario2, usuario3, usuario4);

    // Guardar
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

}