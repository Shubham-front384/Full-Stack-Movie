const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ImageKit, toFile } = require("@imagekit/nodejs");
const { v4: uuidv4 } = require("uuid");
const adminMovieModel = require("../models/movie.model");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

const handleAdminLoginUser = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      const error = new Error('All field required.');
      error.status = 400;
      throw error;
    }

    const isUser = username === 'Shubh@m07';
    if (!isUser) {
      const error = new Error('User credential is wrong.');
      error.status = 401;
      throw error;
    }

    let comparePassword = await bcrypt.compare(
      password,
      process.env.ADMIN_PASS
    );
    if (!comparePassword) {
      const error = new Error('User credential is wrong.');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    res.status(200).json({
      msg: 'Admin login successfully.',
      admin: {
        username
      },
    });
  } catch (err) {
    next(err);
  }
};

const handleAdminCreateMovie = async (req, res, next) => {
  try {
    const { title, description, releaseDate, link, genre, category, rating } = req.body;

    if (!title || !description || !releaseDate || !link || !genre || !category || !rating) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    const uniqueFileName = `${uuidv4()}-${req.file.originalname}`;
    const uploadedImage = await imageKit.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: uniqueFileName,
      folder: "movies"
    });

    const movie = await adminMovieModel.create({
      title,
      description,
      releaseDate,
      link,
      genre,
      category,
      rating,
      image: uploadedImage.url
    });

    res.status(201).json({
      message: "Movie created successfully",
      movie
    });

  } catch (err) {
    next(err);
  }
};

const handleAdminMovies = async (req, res, next) => {
  try {
    const movies = await adminMovieModel.find();

    res.status(200).json({
      message: "Movies fetched successfully",
      movies
    });
  } catch(err) {
    next(err);
  }
}

module.exports = {
  handleAdminLoginUser,
  handleAdminCreateMovie,
  handleAdminMovies
};
