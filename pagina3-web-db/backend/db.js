// Conexión a la base de datos MySQL
const mysql = require("mysql2/promise");
const config = require("./config");

// Un "pool" reutiliza conexiones, así no abrimos una nueva en cada consulta
const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
