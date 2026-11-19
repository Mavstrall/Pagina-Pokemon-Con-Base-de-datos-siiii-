// Carga database/pokedex.sql en la base de datos indicada en .env
// Sirve para bases de datos en la nube, donde no se puede usar el comando "mysql".
// Uso:  npm run cargar-bd
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const config = require("./config");

async function cargar() {
  const archivo = path.join(__dirname, "..", "database", "pokedex.sql");

  // Quitamos las líneas que crean o eligen la base de datos:
  // usamos la que está en DB_NAME (en la nube ya viene creada).
  const sql = fs.readFileSync(archivo, "utf8")
    .split("\n")
    .filter((linea) => !/^\s*(DROP DATABASE|CREATE DATABASE|USE )/i.test(linea))
    .join("\n");

  const conexion = await mysql.createConnection({ ...config, multipleStatements: true });

  try {
    await conexion.query(sql);
    console.log("Base de datos cargada correctamente en '" + config.database + "'");
  } catch (error) {
    console.error("No se pudo cargar el archivo SQL:", error.message);
    process.exitCode = 1;
  } finally {
    await conexion.end();
  }
}

cargar().catch((error) => {
  console.error("No se pudo conectar:", error.message);
  process.exitCode = 1;
});
