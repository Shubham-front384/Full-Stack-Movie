const express = require("express");
const { handleAllMovies, handleGetTrendingMovies, handleGetPopularMovies, handleSearchMovies, handleGetMovieDetails, handleGetMovieVideos } = require("../controllers/movie.controller");

const movieRoute = express.Router();

// /api/movies/all
movieRoute.get("/all", handleAllMovies);
// /api/movies/trending
movieRoute.get("/trending", handleGetTrendingMovies);
// /api/movies/popular
movieRoute.get("/popular", handleGetPopularMovies);
// /api/movies/search
movieRoute.get("/search", handleSearchMovies);
// /api/movies/:id
movieRoute.get("/:id", handleGetMovieDetails);
// /api/movies/:id/videos
movieRoute.get("/:id/videos", handleGetMovieVideos);

module.exports = movieRoute;
