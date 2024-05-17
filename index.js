const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "database.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDBAndServer();

// GET All Movies

app.get("/movies", async (request, response) => {
  const dbQuery = `SELECT * FROM movies;`;
  const moviesData = await db.all(dbQuery);
  response.send(moviesData);
});

// GET A Single Movie

app.get("/movies/:id", async (request, response) => {
  const { id } = request.params;
  const dbQuery = `SELECT * FROM movies WHERE id=${id};`;
  const moviesData = await db.get(dbQuery);
  response.send(moviesData);
});

// CREATE a Movie Record

app.post("/movies", async (request, response) => {
  const movieDetails = request.body;
  const { name, img, summary } = movieDetails;
  const addMovieQuery = `INSERT INTO movies(name, img, summary) VALUES(${name}, ${img}, ${summary});`;
  const addedMovie = await db.run(addMovieQuery);
  response.send(addedMovie.lastID);
});

// UPDATE a Movie

app.put("/movies/:id", async (request, response) => {
  const { id } = request.params;
  const movieDetails = request.body;
  const { name, img, summary } = movieDetails;
  const updateMovieQuery = `UPDATE movies SET name = ${name}, img=${img}, summary=${summary} WHERE id = ${id};`;
  await db.run(updateMovieQuery);
  response.send("Movie Updated Succesfully");
});

// DELETE a Movie

app.delete("/movies/:id", async (request, response) => {
  const { id } = request.params;
  const deleteMovieQuery = `DELETE FROM movies WHERE id = ${id};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Deleted Successfully");
});
