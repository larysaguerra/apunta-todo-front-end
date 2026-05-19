import { CATEGORIA_OTROS } from "./categorias.js";

export class Detalle {
    constructor(idLista, producto, completado, categoria = CATEGORIA_OTROS) {
        this.id = Date.now();
        this.idLista = idLista;
        this.producto = producto;
        this.completado = completado;
        this.categoria = categoria;
    }
}
