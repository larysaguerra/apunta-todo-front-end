export class Usuario {
    constructor(nombre, apellido, correo, telefono, nombreUsuario, password, rol = "usuario") {
        this.id = Date.now();
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.rol = rol;
    }
}