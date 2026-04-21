import { Usuario } from "../models/usuario.js";
import { Lista } from "../models/lista.js";
import { Detalle } from "../models/detalle.js";

let idUsuario = getCurrentUserId();

construirListas();

// UI: event listeners
const btnAgregarLista = document.getElementById("btnAgregarLista");
const btnCerrar = document.getElementById("btnCerrar");
const editDialog = document.getElementById("edit-dialog");
const btnEliminarListaDialog = document.getElementById("btnEliminar");
const btnGuardarTitulo = document.getElementById("btnGuardar");
const btnAgregarItem = document.getElementById("btnAgregarItem");
const inputNuevoItem = document.getElementById("inputNuevoItem");

btnAgregarLista.addEventListener("click", crearLista);
btnCerrar.addEventListener("click", function () {
    editDialog.close();
    construirListas();
});

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
                <ul>${detalles.map((detalle) => `<li ${detalle.completado ? 'style="text-decoration: line-through;"' : ''}>${detalle.producto}</li>`).join("")}</ul>
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

function rellenarDatosLista(idLista) {
    const lista = getListById(idLista);
    if (!lista) {
        return;
    }

    document.getElementById("tituloLista").textContent = lista.titulo;

    document.getElementById("fechaEdicion").textContent = "Editado el: " + new Date(lista.fechaEdicion).toLocaleDateString();
    inputNuevoItem.value = "";

    const detalleLista = document.getElementById("detalleListaUl");
    detalleLista.innerHTML = "";

    const detalles = getDetailsByListId(idLista);
    detalles.forEach((detalle) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const textoSpan = document.createElement("span");
        const botonesDiv = document.createElement("div");
        const btnEditar = document.createElement("button");
        const btnEliminarDetalle = document.createElement("button");

        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.marginBottom = "10px";

        checkbox.type = "checkbox";
        checkbox.checked = detalle.completado;
        checkbox.addEventListener("change", function () {
            detalle.completado = this.checked;
            updateDetail(detalle);
            rellenarDatosLista(idLista);
            construirListas();
        });

        textoSpan.textContent = detalle.producto;
        textoSpan.style.flex = "1";
        textoSpan.style.marginLeft = "8px";
        textoSpan.style.textDecoration = detalle.completado ? "line-through" : "none";

        botonesDiv.style.display = "flex";
        botonesDiv.style.gap = "8px";
        botonesDiv.style.marginLeft = "10px";

        btnEditar.textContent = "✏️";
        btnEditar.style.background = "none";
        btnEditar.style.border = "none";
        btnEditar.style.cursor = "pointer";
        btnEditar.style.fontSize = "18px";
        btnEditar.addEventListener("click", function (e) {
            e.stopPropagation();
            const nuevoNombre = prompt("Editar item:", detalle.producto);
            if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
                detalle.producto = nuevoNombre.trim();
                updateDetail(detalle);
                rellenarDatosLista(idLista);
                construirListas();
            }
        });

        btnEliminarDetalle.textContent = "🗑️";
        btnEliminarDetalle.style.background = "none";
        btnEliminarDetalle.style.border = "none";
        btnEliminarDetalle.style.cursor = "pointer";
        btnEliminarDetalle.style.fontSize = "18px";
        btnEliminarDetalle.addEventListener("click", function (e) {
            e.stopPropagation();
            const confirmar = confirm("¿Está seguro de que desea eliminar este item?");
            if (confirmar) {
                deleteDetailById(detalle.id);
                rellenarDatosLista(idLista);
                construirListas();
            }
        });

        botonesDiv.appendChild(btnEditar);
        botonesDiv.appendChild(btnEliminarDetalle);

        li.appendChild(checkbox);
        li.appendChild(textoSpan);
        li.appendChild(botonesDiv);
        detalleLista.appendChild(li);
    });

    btnAgregarItem.onclick = function (e) {
        e.stopPropagation();
        const nombreProducto = inputNuevoItem.value.trim();
        if (nombreProducto === "") {
            alert("Por favor, ingresa un nombre para el item");
            return;
        }

        const nuevoDetalle = new Detalle(idLista, nombreProducto, false);
        addDetail(nuevoDetalle);
        inputNuevoItem.value = "";
        rellenarDatosLista(idLista);
        construirListas();
    };

    btnEliminarListaDialog.onclick = function () {
        const confirmar = confirm("¿Está seguro de que desea eliminar esta lista? Esta acción no se puede deshacer.");
        if (confirmar) {
            deleteListWithDetails(idLista);
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

// STORAGE: localStorage helpers
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
    return getAllLists().find((lista) => lista.id === idLista);
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
