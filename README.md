# Pokédex con Base de Datos

Página web que muestra Pokémon guardados en una base de datos **MySQL**.
Un servidor **Node.js + Express** entrega los datos mediante una API y la página
los muestra con tarjetas de **Bootstrap**. Se pueden filtrar por nombre, número y tipo
sin recargar la página.


## Integrantes
- Miguel Villarroel

## Qué incluye el proyecto
- Base de datos MySQL con 2 tablas relacionadas (`tipos` y `pokemon`), 15 tipos y 32 Pokémon.
- Archivo SQL (`database/pokedex.sql`) para crear y cargar la base de datos.
- API REST con Express que lee los datos desde MySQL.
- Página con Bootstrap que muestra los datos y los filtra dinámicamente.
- Pruebas de las rutas con Thunder Client (con capturas).

## Tecnologías
HTML, CSS, JavaScript, Bootstrap 5, Node.js, Express, MySQL (mysql2) y Git.

## Estructura de carpetas
```
pagina3-web-db/
├── README.md
├── .gitignore
├── database/
│   └── pokedex.sql            <- archivo SQL (tablas y datos)
├── backend/
│   ├── package.json
│   ├── .env.example           <- plantilla de los datos de conexión
│   ├── config.js              <- lee la configuración del archivo .env
│   ├── db.js                  <- conexión a MySQL
│   ├── cargar-bd.js           <- carga el .sql en una base de datos en la nube (opcional)
│   └── server.js              <- servidor y rutas de la API
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js              <- pide los datos a la API y los filtra en pantalla
└── thunder-client/
    ├── PRUEBAS.md             <- pruebas de las rutas, con sus resultados
    └── capturas/              <- capturas de Thunder Client
```

## Requisitos
- **Node.js** 18 o superior (https://nodejs.org, versión LTS)
- **MySQL** 8 (o MariaDB)
- **Git**

## Cómo ejecutarlo

### 1. Descargar el proyecto
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

### 2. Cargar la base de datos
Con MySQL encendido, abre **MySQL 8.0 Command Line Client**, escribe tu contraseña y ejecuta
(con la ruta de tu computador y usando `/` en vez de `\`):
```sql
source C:/ruta/al/proyecto/database/pokedex.sql
```
Para comprobar que se cargó:
```sql
USE pokedex_db;
SELECT COUNT(*) FROM pokemon;
```
Debe mostrar **32**. Otra forma es ejecutar `mysql -u root -p < database/pokedex.sql`
o importar el archivo desde phpMyAdmin o MySQL Workbench.

### 3. Configurar la conexión
Dentro de la carpeta `backend`, copia `.env.example` con el nombre `.env`:
```bash
cd backend
copy .env.example .env
```
(En Mac o Linux: `cp .env.example .env`). Abre el archivo `.env` y escribe la contraseña de tu MySQL:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_real
DB_NAME=pokedex_db
```
El archivo `.env` no se sube a Git (está en `.gitignore`), porque contiene la contraseña.

### 4. Instalar y encender el servidor
Dentro de la carpeta `backend`:
```bash
npm install
npm start
```
Debe aparecer `Servidor listo en http://localhost:3000`. Deja esa terminal abierta mientras uses la página.

### 5. Abrir la página
Entra a **http://localhost:3000** en el navegador. Arriba a la derecha debe aparecer
**"Base de datos conectada"** en verde, junto con las tarjetas de los Pokémon.

## Rutas de la API
| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api` | Información y lista de rutas |
| GET | `/api/salud` | Comprueba la conexión con la base de datos |
| GET | `/api/tipos` | Lista los tipos |
| GET | `/api/pokemon` | Lista todos los Pokémon |
| GET | `/api/pokemon?tipo=Fuego` | Lista los Pokémon de un tipo |
| GET | `/api/pokemon/:numero` | Un Pokémon por su número de Pokédex (404 si no existe) |

Las pruebas de estas rutas con Thunder Client, con sus capturas, están en
[`thunder-client/PRUEBAS.md`](thunder-client/PRUEBAS.md).

## Base de datos
Tabla `tipos`: `id`, `nombre`.

Tabla `pokemon`: `id`, `numero`, `nombre`, `tipo1_id`, `tipo2_id`, `hp`, `ataque`, `defensa`, `velocidad`.

`tipo1_id` y `tipo2_id` apuntan a la tabla `tipos` (el segundo tipo puede quedar vacío).
Por ejemplo, Charizard es Fuego/Volador y Pikachu solo Eléctrico.

## Cómo funciona el filtro
La página descarga todos los Pokémon una sola vez desde la API. Cada vez que se escribe en el buscador
o se cambia el tipo, la función `filtrar()` de `frontend/js/app.js` recorre la lista, se queda con
los que coinciden y vuelve a dibujar solo esas tarjetas. Todo ocurre en el navegador, sin recargar la página.

## Si algo falla
| Problema | Solución |
|---|---|
| `npm` no se reconoce | Falta instalar Node.js. Después, cierra y vuelve a abrir VS Code. |
| PowerShell dice que la ejecución de scripts está deshabilitada | Ejecuta `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` o usa `npm.cmd` en vez de `npm`. |
| La página dice "Sin conexión" | El servidor no está encendido (`npm start`) o falla la conexión a MySQL. Abre http://localhost:3000/api/salud para ver el motivo. |
| `Access denied for user 'root'` | La contraseña de `.env` no coincide con la de MySQL. Reinicia el servidor después de cambiarla. |
| `Unknown database 'pokedex_db'` | Falta cargar `database/pokedex.sql` (paso 2). |
| `EADDRINUSE` | El puerto 3000 ya está ocupado. Cierra la otra terminal o cambia `PORT` en `.env`. |

## Alternativa sin instalar MySQL (base de datos en la nube)
Si no hay espacio para instalar MySQL, se puede usar una base de datos MySQL gratuita en la nube,
por ejemplo **TiDB Cloud Starter** (compatible con MySQL). En `backend/.env` se completan los datos
que entrega el servicio y se cargan los datos con `npm run cargar-bd`:
```
DB_HOST=...
DB_PORT=4000
DB_USER=...
DB_PASSWORD=...
DB_NAME=test
DB_SSL=true
```
Luego se enciende el servidor con `npm start`. Los planes gratuitos pueden cambiar con el tiempo.