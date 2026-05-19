/** Orden del recorrido de compra en la lista */
export const CATEGORIAS_PRODUCTO = [
    "Fruver",
    "Carnicería",
    "Lácteos",
    "Despensa",
    "Bebidas",
    "Snacks",
    "Limpieza",
    "Aseo Personal",
    "Mascotas",
    "Panadería",
    "Congelados",
    "Otros",
];

export const CATEGORIA_OTROS = "Otros";

export class Categoria {
    constructor(nombre) {
        this.id = Date.now();
        this.nombre = nombre;
    }
}
