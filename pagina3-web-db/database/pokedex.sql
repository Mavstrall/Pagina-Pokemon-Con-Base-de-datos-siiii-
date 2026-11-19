-- ============================================================
-- Pokédex con base de datos - Dump SQL (MySQL / MariaDB)
-- Cómo cargarlo:  mysql -u root -p < database/pokedex.sql
-- (o importarlo desde phpMyAdmin / MySQL Workbench)
-- ============================================================

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS pokedex_db;
CREATE DATABASE pokedex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pokedex_db;

DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS tipos;

-- ------------------------------------------------------------
-- Tabla de tipos
-- ------------------------------------------------------------
CREATE TABLE tipos (
  id     INT         NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- Tabla de Pokémon (cada uno tiene un tipo principal y, opcionalmente, un segundo tipo)
-- ------------------------------------------------------------
CREATE TABLE pokemon (
  id        INT         NOT NULL AUTO_INCREMENT,
  numero    INT         NOT NULL UNIQUE,
  nombre    VARCHAR(50) NOT NULL,
  tipo1_id  INT         NOT NULL,
  tipo2_id  INT         NULL,
  hp        INT         NOT NULL,
  ataque    INT         NOT NULL,
  defensa   INT         NOT NULL,
  velocidad INT         NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tipo1_id) REFERENCES tipos (id),
  FOREIGN KEY (tipo2_id) REFERENCES tipos (id)
);

-- ------------------------------------------------------------
-- Datos
-- ------------------------------------------------------------
INSERT INTO tipos (id, nombre) VALUES
  (1, 'Normal'),
  (2, 'Fuego'),
  (3, 'Agua'),
  (4, 'Eléctrico'),
  (5, 'Planta'),
  (6, 'Hielo'),
  (7, 'Lucha'),
  (8, 'Veneno'),
  (9, 'Tierra'),
  (10, 'Volador'),
  (11, 'Psíquico'),
  (12, 'Bicho'),
  (13, 'Roca'),
  (14, 'Fantasma'),
  (15, 'Dragón');

INSERT INTO pokemon (numero, nombre, tipo1_id, tipo2_id, hp, ataque, defensa, velocidad) VALUES
  (1, 'Bulbasaur', 5, 8, 45, 49, 49, 45),
  (2, 'Ivysaur', 5, 8, 60, 62, 63, 60),
  (3, 'Venusaur', 5, 8, 80, 82, 83, 80),
  (4, 'Charmander', 2, NULL, 39, 52, 43, 65),
  (5, 'Charmeleon', 2, NULL, 58, 64, 58, 80),
  (6, 'Charizard', 2, 10, 78, 84, 78, 100),
  (7, 'Squirtle', 3, NULL, 44, 48, 65, 43),
  (8, 'Wartortle', 3, NULL, 59, 63, 80, 58),
  (9, 'Blastoise', 3, NULL, 79, 83, 100, 78),
  (25, 'Pikachu', 4, NULL, 35, 55, 40, 90),
  (26, 'Raichu', 4, NULL, 60, 90, 55, 110),
  (54, 'Psyduck', 3, NULL, 50, 52, 48, 55),
  (59, 'Arcanine', 2, NULL, 90, 110, 80, 95),
  (65, 'Alakazam', 11, NULL, 55, 50, 45, 120),
  (68, 'Machamp', 7, NULL, 90, 130, 80, 55),
  (74, 'Geodude', 13, 9, 40, 80, 100, 20),
  (94, 'Gengar', 14, 8, 60, 65, 60, 110),
  (95, 'Onix', 13, 9, 35, 45, 160, 70),
  (129, 'Magikarp', 3, NULL, 20, 10, 55, 80),
  (130, 'Gyarados', 3, 10, 95, 125, 79, 81),
  (131, 'Lapras', 3, 6, 130, 85, 80, 60),
  (133, 'Eevee', 1, NULL, 55, 55, 50, 55),
  (134, 'Vaporeon', 3, NULL, 130, 65, 60, 65),
  (135, 'Jolteon', 4, NULL, 65, 65, 60, 130),
  (136, 'Flareon', 2, NULL, 65, 130, 60, 65),
  (143, 'Snorlax', 1, NULL, 160, 110, 65, 30),
  (144, 'Articuno', 6, 10, 90, 85, 100, 85),
  (145, 'Zapdos', 4, 10, 90, 90, 85, 100),
  (146, 'Moltres', 2, 10, 90, 100, 90, 90),
  (149, 'Dragonite', 15, 10, 91, 134, 95, 80),
  (150, 'Mewtwo', 11, NULL, 106, 110, 90, 130),
  (151, 'Mew', 11, NULL, 100, 100, 100, 100);
