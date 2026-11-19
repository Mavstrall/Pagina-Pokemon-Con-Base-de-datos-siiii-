// ---------- Configuración ----------
// Dirección de la API (el servidor de la carpeta backend)
const API = "http://localhost:3000/api";
const URL_IMAGENES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

// Color de cada tipo
const colores = {
  "Normal": "#7d7d6b", "Fuego": "#e2561f", "Agua": "#2f7fd8", "Eléctrico": "#c99a00",
  "Planta": "#3e9b3b", "Hielo": "#3aa7b8", "Lucha": "#b3342b", "Veneno": "#8e3fa8",
  "Tierra": "#a8803a", "Volador": "#6e85d6", "Psíquico": "#d8456f", "Bicho": "#7e9a12",
  "Roca": "#8c7b3e", "Fantasma": "#5b4a8c", "Dragón": "#4b38c9"
};

let todos = [];   // aquí guardamos todos los Pokémon que llegan de la base de datos

// ---------- Pedir datos a la API ----------
async function pedirDatos(ruta) {
  const respuesta = await fetch(API + ruta);
  if (!respuesta.ok) {
    throw new Error("El servidor respondió con el error " + respuesta.status);
  }
  return respuesta.json();
}

async function iniciar() {
  try {
    await pedirDatos("/salud");
    const estado = document.getElementById("estado");
    estado.textContent = "Base de datos conectada";
    estado.className = "badge text-bg-success";

    todos = await pedirDatos("/pokemon");
    const tipos = await pedirDatos("/tipos");

    llenarTipos(tipos);
    mostrar(todos);
  } catch (error) {
    const estado = document.getElementById("estado");
    estado.textContent = "Sin conexión";
    estado.className = "badge text-bg-danger";

    document.getElementById("contador").textContent = "";
    document.getElementById("lista").innerHTML = `
      <div class="alert alert-danger">
        No se pudo cargar la información. Revisa que el servidor esté encendido
        (<code>npm start</code> en la carpeta backend) y que la base de datos esté cargada.
        <br><small>${error.message}</small>
      </div>`;
  }
}

// ---------- Dibujar en pantalla ----------
function llenarTipos(tipos) {
  const select = document.getElementById("filtroTipo");
  for (let i = 0; i < tipos.length; i++) {
    select.innerHTML += `<option value="${tipos[i].nombre}">${tipos[i].nombre}</option>`;
  }
}

function crearInsignia(tipo) {
  if (!tipo) {
    return "";
  }
  return `<span class="badge me-1" style="background-color: ${colores[tipo]}">${tipo}</span>`;
}

function crearBarra(nombre, valor) {
  const porcentaje = Math.min(100, valor / 255 * 100);
  return `
    <div class="stat">${nombre}: <strong>${valor}</strong></div>
    <div class="progress">
      <div class="progress-bar bg-danger" style="width: ${porcentaje}%"></div>
    </div>`;
}

function mostrar(lista) {
  let html = "";

  for (let i = 0; i < lista.length; i++) {
    const p = lista[i];
    html += `
      <article class="col-6 col-md-4 col-lg-3">
        <div class="card tarjeta-pokemon">
          <img src="${URL_IMAGENES + p.numero}.png" class="card-img-top" alt="${p.nombre}" loading="lazy">
          <div class="card-body">
            <span class="numero">N.º ${p.numero}</span>
            <h3 class="h5 nombre">${p.nombre}</h3>
            <div class="mb-2">${crearInsignia(p.tipo1)}${crearInsignia(p.tipo2)}</div>
            ${crearBarra("PS", p.hp)}
            ${crearBarra("Ataque", p.ataque)}
            ${crearBarra("Defensa", p.defensa)}
            ${crearBarra("Velocidad", p.velocidad)}
          </div>
        </div>
      </article>`;
  }

  if (lista.length == 0) {
    html = '<div class="alert alert-warning">No se encontró ningún Pokémon con esos filtros.</div>';
  }

  document.getElementById("lista").innerHTML = html;
  document.getElementById("contador").textContent =
    "Mostrando " + lista.length + " de " + todos.length + " Pokémon";
}

// ---------- Filtro en el DOM ----------
function filtrar() {
  const texto = document.getElementById("buscador").value.toLowerCase().trim();
  const tipo = document.getElementById("filtroTipo").value;
  const encontrados = [];

  for (let i = 0; i < todos.length; i++) {
    const p = todos[i];

    const coincideTexto = p.nombre.toLowerCase().includes(texto) || String(p.numero) == texto;
    const coincideTipo = (tipo == "") || (p.tipo1 == tipo) || (p.tipo2 == tipo);

    if (coincideTexto && coincideTipo) {
      encontrados.push(p);
    }
  }

  mostrar(encontrados);
}

function limpiarFiltros() {
  document.getElementById("buscador").value = "";
  document.getElementById("filtroTipo").value = "";
  mostrar(todos);
}

iniciar();
