const express = require("express");
const { handleAdminLoginUser, handleAdminCreateMovie, handleAdminMovies } = require("../controllers/admin.controller");
const { isAdmin, identifyUser } = require("../middleware/auth.middleware");
const multer = require("multer");

const adminRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// /api/admin/login
adminRoute.post("/login", handleAdminLoginUser);

// /api/admin/create-movie
adminRoute.post("/create-movie", upload.single("image"), identifyUser, isAdmin, handleAdminCreateMovie);

// /api/admin/movies
adminRoute.get("/movies", identifyUser, isAdmin, handleAdminMovies);

module.exports = adminRoute;
