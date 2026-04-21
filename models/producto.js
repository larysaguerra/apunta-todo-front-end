export class Producto {
    constructor(nombre, descripcion = "", categoria = "Otros") {
        this.id = Date.now();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
    }
}