import { Lista } from "../models/lista.js";
import { Detalle } from "../models/detalle.js";
import { CATEGORIAS_PRODUCTO, CATEGORIA_OTROS } from "../models/categorias.js";

let idUsuario = getCurrentUserId();
let pendingItem = null;

const btnAgregarLista = document.getElementById("btnAgregarLista");
const btnCerrar = document.getElementById("btnCerrar");
const editDialog = document.getElementById("edit-dialog");
const categoryDialog = document.getElementById("category-dialog");
const btnEliminarListaDialog = document.getElementById("btnEliminar");
const btnGuardarTitulo = document.getElementById("btnGuardar");
const btnAgregarItem = document.getElementById("btnAgregarItem");
const inputNuevoItem = document.getElementById("inputNuevoItem");
const categoryDialogTitle = document.getElementById("category-dialog-title");
const categoryGrid = document.getElementById("category-grid");
const btnCancelarCategoria = document.getElementById("btnCancelarCategoria");

btnAgregarLista.addEventListener("click", crearLista);
btnCerrar.addEventListener("click", function () {
    editDialog.close();
    categoryDialog.close();
    pendingItem = null;
    construirListas();
});

btnCancelarCategoria.addEventListener("click", function () {
    categoryDialog.close();
    pendingItem = null;
});

btnAgregarItem.addEventListener("click", function (e) {
    e.preventDefault();
    const idLista = editDialog.dataset.listaId;
    if (!idLista) {
        return;
    }

    const nombreProducto = inputNuevoItem.value.trim();
    if (nombreProducto === "") {
        alert("Por favor, ingresa un nombre para el item");
        return;
    }

    abrirSelectorCategoria({
        idLista,
        producto: nombreProducto,
        mode: "create",
    });
});

initCategoryDialog();
construirListas();

function initCategoryDialog() {
    categoryGrid.innerHTML = "";
    CATEGORIAS_PRODUCTO.forEach((categoria) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "category-chip";
        btn.textContent = categoria;
        btn.addEventListener("click", function () {
            confirmarCategoria(categoria);
        });
        categoryGrid.appendChild(btn);
    });
}

function confirmarCategoria(categoria) {
    if (!pendingItem) {
        return;
    }

    if (pendingItem.mode === "create") {
        const nuevoDetalle = new Detalle(pendingItem.idLista, pendingItem.producto, false, categoria);
        addDetail(nuevoDetalle);
        inputNuevoItem.value = "";
    } else if (pendingItem.mode === "edit" && pendingItem.detalle) {
        pendingItem.detalle.producto = pendingItem.producto;
        pendingItem.detalle.categoria = categoria;
        updateDetail(pendingItem.detalle);
    }

    const idLista = pendingItem.idLista;
    pendingItem = null;
    categoryDialog.close();
    rellenarDatosLista(idLista);
    construirListas();
}

function abrirSelectorCategoria({ idLista, producto, mode, detalle = null }) {
    pendingItem = { idLista, producto, mode, detalle };
    categoryDialogTitle.textContent =
        mode === "edit" ? `Cambiar categoría de «${producto}»` : `¿Dónde va «${producto}»?`;
    categoryDialog.showModal();
}

function normalizarCategoria(categoria) {
    if (!categoria || !CATEGORIAS_PRODUCTO.includes(categoria)) {
        return CATEGORIA_OTROS;
    }
    return categoria;
}

function normalizarDetalle(detalle) {
    detalle.categoria = normalizarCategoria(detalle.categoria);
    return detalle;
}

function agruparDetallesPorCategoria(detalles) {
    const grupos = {};
    detalles.forEach((detalle) => {
        const categoria = normalizarCategoria(detalle.categoria);
        if (!grupos[categoria]) {
            grupos[categoria] = [];
        }
        grupos[categoria].push(detalle);
    });
    return grupos;
}

function crearLista() {
    const titulo = document.getElementById("inputTitulo").value.trim();
    if (titulo === "") {
        alert("Por favor, complete el campo de 'nombre de lista'.");
        return;
    }

    const nuevaLista = new Lista(idUsuario, titulo, Date.now(), Date.now());
    const listas = getAllLists();
    listas.push(nuevaLista);
    saveAllLists(listas);

    document.getElementById("inputTitulo").value = "";
    construirListas();
    mostrarDialogoEdicion(nuevaLista.id);
}

function construirHtmlListaAgrupada(detalles) {
    const detallesNormalizados = detalles.map((d) => normalizarDetalle({ ...d }));
    const grupos = agruparDetallesPorCategoria(detallesNormalizados);
    let html = "";

    CATEGORIAS_PRODUCTO.forEach((categoria) => {
        const items = grupos[categoria];
        if (!items || items.length === 0) {
            return;
        }

        html += `<li class="categoria-seccion"><span class="categoria-seccion-titulo">${categoria}</span><ul>`;
        items.forEach((detalle) => {
            const tachado = detalle.completado ? ' style="text-decoration: line-through;"' : "";
            html += `<li${tachado}>${detalle.producto}</li>`;
        });
        html += "</ul></li>";
    });

    return html || "<li>Sin productos</li>";
}

function construirListas() {
    const contenedorListas = document.getElementById("cards-container");
    contenedorListas.innerHTML = "";

    getListsByUsuario(idUsuario).forEach((lista) => {
        const detalles = getDetailsByListId(lista.id);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-header">
                <h3>${lista.titulo}</h3>
                <div class="card-actions">
                    <button class="delete-btn" id="btnEliminarLista">🗑️</button>
                </div>
            </div>
            <div class="card-content">
                <ul class="lista-agrupada">${construirHtmlListaAgrupada(detalles)}</ul>
            </div>
            <p class="card-caption">Editado el: ${new Date(lista.fechaEdicion).toLocaleDateString()}</p>
        `;

        card.addEventListener("dblclick", function () {
            mostrarDialogoEdicion(lista.id);
        });

        card.querySelector("#btnEliminarLista").addEventListener("click", function (e) {
            e.stopPropagation();
            const confirmar = confirm("¿Está seguro de que desea eliminar esta lista? Esta acción no se puede deshacer.");
            if (confirmar) {
                deleteListWithDetails(lista.id);
                construirListas();
            }
        });

        contenedorListas.appendChild(card);
    });
}

function mostrarDialogoEdicion(idLista) {
    editDialog.dataset.listaId = idLista;
    editDialog.showModal();
    rellenarDatosLista(idLista);
}

function crearFilaDetalle(detalle, idLista) {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const textoSpan = document.createElement("span");
    const botonesDiv = document.createElement("div");
    const btnEditar = document.createElement("button");
    const btnEliminarDetalle = document.createElement("button");

    li.className = "detalle-item";

    checkbox.type = "checkbox";
    checkbox.checked = detalle.completado;
    checkbox.addEventListener("change", function () {
        detalle.completado = this.checked;
        updateDetail(detalle);
        rellenarDatosLista(idLista);
        construirListas();
    });

    textoSpan.textContent = detalle.producto;
    textoSpan.className = "detalle-item-nombre";
    if (detalle.completado) {
        textoSpan.classList.add("completado");
    }

    btnEditar.type = "button";
    btnEditar.textContent = "✏️";
    btnEditar.className = "detalle-btn-icono";
    btnEditar.addEventListener("click", function (e) {
        e.stopPropagation();
        const nuevoNombre = prompt("Editar producto:", detalle.producto);
        if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
            abrirSelectorCategoria({
                idLista,
                producto: nuevoNombre.trim(),
                mode: "edit",
                detalle,
            });
        }
    });

    btnEliminarDetalle.type = "button";
    btnEliminarDetalle.textContent = "🗑️";
    btnEliminarDetalle.className = "detalle-btn-icono";
    btnEliminarDetalle.addEventListener("click", function (e) {
        e.stopPropagation();
        const confirmar = confirm("¿Está seguro de que desea eliminar este item?");
        if (confirmar) {
            deleteDetailById(detalle.id);
            rellenarDatosLista(idLista);
            construirListas();
        }
    });

    botonesDiv.className = "detalle-item-acciones";
    botonesDiv.appendChild(btnEditar);
    botonesDiv.appendChild(btnEliminarDetalle);

    li.appendChild(checkbox);
    li.appendChild(textoSpan);
    li.appendChild(botonesDiv);

    return li;
}

function renderizarDetallesAgrupados(idLista, contenedor) {
    contenedor.innerHTML = "";
    const detalles = getDetailsByListId(idLista);
    detalles.forEach((d) => {
        d.categoria = normalizarCategoria(d.categoria);
    });
    const grupos = agruparDetallesPorCategoria(detalles);

    CATEGORIAS_PRODUCTO.forEach((categoria) => {
        const items = grupos[categoria];
        if (!items || items.length === 0) {
            return;
        }

        const seccion = document.createElement("li");
        seccion.className = "categoria-grupo";

        const titulo = document.createElement("h4");
        titulo.className = "categoria-titulo";
        titulo.textContent = categoria;

        const ul = document.createElement("ul");
        ul.className = "categoria-items";

        items.forEach((detalle) => {
            ul.appendChild(crearFilaDetalle(detalle, idLista));
        });

        seccion.appendChild(titulo);
        seccion.appendChild(ul);
        contenedor.appendChild(seccion);
    });

    if (contenedor.children.length === 0) {
        const vacio = document.createElement("li");
        vacio.className = "lista-vacia";
        vacio.textContent = "Aún no hay productos en esta lista.";
        contenedor.appendChild(vacio);
    }
}

function rellenarDatosLista(idLista) {
    const lista = getListById(idLista);
    if (!lista) {
        return;
    }

    document.getElementById("tituloLista").textContent = lista.titulo;
    document.getElementById("fechaEdicion").textContent = "Editado el: " + new Date(lista.fechaEdicion).toLocaleDateString();
    inputNuevoItem.value = "";

    const detalleLista = document.getElementById("detalleListaUl");
    renderizarDetallesAgrupados(idLista, detalleLista);

    btnEliminarListaDialog.onclick = function () {
        const confirmar = confirm("¿Está seguro de que desea eliminar esta lista? Esta acción no se puede deshacer.");
        if (confirmar) {
            deleteListWithDetails(idLista);
            categoryDialog.close();
            pendingItem = null;
            editDialog.close();
            construirListas();
        }
    };

    btnGuardarTitulo.onclick = function () {
        const tituloActualizado = document.getElementById("tituloLista").textContent.trim();
        if (tituloActualizado === "") {
            alert("El título de la lista no puede estar vacío.");
            return;
        }
        lista.titulo = tituloActualizado;
        lista.fechaEdicion = Date.now();
        updateList(lista);
        construirListas();
    };
}

function getCurrentUserId() {
    return JSON.parse(localStorage.getItem("nombreUsuarioActual")) || null;
}

function getAllLists() {
    return JSON.parse(localStorage.getItem("lista")) || [];
}

function saveAllLists(listas) {
    localStorage.setItem("lista", JSON.stringify(listas));
}

function getListsByUsuario(usuarioId) {
    return getAllLists().filter((lista) => lista.idUsuario == usuarioId);
}

function getListById(idLista) {
    return getAllLists().find((lista) => lista.id == idLista);
}

function updateList(listaActualizada) {
    const listas = getAllLists().map((lista) => (lista.id === listaActualizada.id ? listaActualizada : lista));
    saveAllLists(listas);
}

function deleteListWithDetails(idLista) {
    saveAllLists(getAllLists().filter((lista) => lista.id !== idLista));
    deleteDetailsByListId(idLista);
}

function getAllDetails() {
    return JSON.parse(localStorage.getItem("detalle")) || [];
}

function saveAllDetails(detalles) {
    localStorage.setItem("detalle", JSON.stringify(detalles));
}

function getDetailsByListId(idLista) {
    return getAllDetails().filter((detalle) => detalle.idLista == idLista);
}

function addDetail(detalle) {
    const detalles = getAllDetails();
    detalles.push(detalle);
    saveAllDetails(detalles);
}

function updateDetail(detalleActualizado) {
    const detalles = getAllDetails().map((detalle) => (detalle.id === detalleActualizado.id ? detalleActualizado : detalle));
    saveAllDetails(detalles);
}

function deleteDetailById(idDetalle) {
    saveAllDetails(getAllDetails().filter((detalle) => detalle.id !== idDetalle));
}

function deleteDetailsByListId(idLista) {
    saveAllDetails(getAllDetails().filter((detalle) => detalle.idLista !== idLista));
}
