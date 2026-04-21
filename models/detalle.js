export class Detalle {
    constructor(idLista, producto, completado) {
        this.id = Date.now();
        this.idLista = idLista;
        this.producto = producto;
        this.completado = completado;
    }
}
