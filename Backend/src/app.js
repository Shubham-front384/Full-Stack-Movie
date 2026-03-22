const express = require("express");
const handleError = require("./middleware/error.middleware");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Route require
const userRoute = require("./routes/user.route");
const movieRoute = require("./routes/movie.route");
const adminRoute = require("./routes/admin.route");

// Route use
app.use("/api/auth", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/admin", adminRoute);

app.use(handleError);

module.exports = app;
