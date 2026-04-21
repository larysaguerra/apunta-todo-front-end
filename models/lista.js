export class Lista {
    constructor(idUsuario, titulo, fechaCreacion, fechaEdicion) {
        this.id = Date.now();
        this.idUsuario = idUsuario;
        this.titulo = titulo;
        this.fechaCreacion = fechaCreacion;
        this.fechaEdicion = fechaEdicion;
    }
}