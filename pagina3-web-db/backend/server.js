// Servidor Express: expone la API y también sirve la página (carpeta frontend)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Consulta base: une cada Pokémon con el nombre de sus tipos
const CONSULTA_POKEMON = `
  SELECT p.id, p.numero, p.nombre,
         t1.nombre AS tipo1, t2.nombre AS tipo2,
         p.hp, p.ataque, p.defensa, p.velocidad
  FROM pokemon p
  JOIN tipos t1 ON p.tipo1_id = t1.id
  LEFT JOIN tipos t2 ON p.tipo2_id = t2.id`;

// Respuesta de error común
function responderError(res, error) {
  console.error(error);
  res.status(500).json({ error: "Error al consultar la base de datos", detalle: error.message });
}

// GET /api  -> información general
app.get("/api", (req, res) => {
  res.json({
    mensaje: "API de la Pokédex",
    rutas: ["/api/salud", "/api/tipos", "/api/pokemon", "/api/pokemon?tipo=Fuego", "/api/pokemon/:numero"]
  });
});

// GET /api/salud  -> comprueba que la base de datos responde
app.get("/api/salud", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ estado: "ok", baseDeDatos: "conectada" });
  } catch (error) {
    responderError(res, error);
  }
});

// GET /api/tipos  -> lista de tipos
app.get("/api/tipos", async (req, res) => {
  try {
    const [filas] = await pool.query("SELECT id, nombre FROM tipos ORDER BY nombre");
    res.json(filas);
  } catch (error) {
    responderError(res, error);
  }
});

// GET /api/pokemon  -> todos los Pokémon (opcional: ?tipo=Fuego)
app.get("/api/pokemon", async (req, res) => {
  try {
    let sql = CONSULTA_POKEMON;
    const parametros = [];

    if (req.query.tipo) {
      sql += " WHERE t1.nombre = ? OR t2.nombre = ?";
      parametros.push(req.query.tipo, req.query.tipo);
    }
    sql += " ORDER BY p.numero";

    const [filas] = await pool.query(sql, parametros);
    res.json(filas);
  } catch (error) {
    responderError(res, error);
  }
});

// GET /api/pokemon/:numero  -> un Pokémon por su número de Pokédex
app.get("/api/pokemon/:numero", async (req, res) => {
  try {
    const [filas] = await pool.query(CONSULTA_POKEMON + " WHERE p.numero = ?", [req.params.numero]);

    if (filas.length === 0) {
      return res.status(404).json({ error: "No existe un Pokémon con ese número" });
    }
    res.json(filas[0]);
  } catch (error) {
    responderError(res, error);
  }
});

app.listen(PORT, () => {
  console.log("Servidor listo en http://localhost:" + PORT);
});
