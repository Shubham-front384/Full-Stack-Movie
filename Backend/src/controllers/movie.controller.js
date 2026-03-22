const axios = require("axios");
const { query } = require("express-validator");
const adminMovieModel = require("../models/movie.model");

const handleAllMovies = async (req, res, next) => {
  try {
    const tmdbResponse = await axios.get(`${process.env.TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY
      }
    });

    const tmdbMovies = tmdbResponse.data.results;

    const adminMovies = await adminMovieModel.find();

    const formattedAdminMovies = adminMovies.map(movie => ({
      id: movie._id,
      title: movie.title,
      overview: movie.description,
      poster_path: movie.image,
      release_date: movie.releaseDate,
      genre: movie.genre,
      category: movie.category,
      isCustom: true
    }));

    const allMovies = [...formattedAdminMovies, ...tmdbMovies];

    res.status(200).json({
      message: "Movie data fetched successfully.",
      movies: allMovies
    });
  } catch (err) {
    next(err);
  }
}

const handleGetTrendingMovies = async (req, res, next) => {
  try {
    let tmdbTrending = [];

    try {
      const response = await axios.get(
        `${process.env.TMDB_BASE_URL}/trending/movie/day`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY
          },
          timeout: 5000
        }
      );

      tmdbTrending = response.data.results;

    } catch (err) {
      console.log("TMDB Error:", err.message);
    }

    const adminTrending = await adminMovieModel
      .find({ views: { $gte: 5 } })
      .sort({ views: -1 });

    const formattedAdmin = adminTrending.map(movie => ({
      id: movie._id,
      title: movie.title,
      overview: movie.description,
      poster_path: movie.image,
      release_date: movie.releaseDate,
      isCustom: true
    }));

    const allTrending = [...formattedAdmin, ...tmdbTrending];

    res.status(200).json({
      message: "Trending movies fetched",
      movies: allTrending
    });

  } catch (err) {
    next(err);
  }
};

const handleGetPopularMovies = async (req, res, next) => {
  try {
    let tmdbPopular = [];
    
    try {
      const response = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/popular`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY
          },
          timeout: 5000
        }
      );

      tmdbPopular = response.data.results;

    } catch (err) {
      console.log("TMDB Error:", err.message);
    }

    const adminPopular = await adminMovieModel
      .find({ views: { $gte: 10 } })
      .sort({ views: -1 });

    const formattedAdmin = adminPopular.map(movie => ({
      id: movie._id,
      title: movie.title,
      overview: movie.description,
      poster_path: movie.image,
      release_date: movie.releaseDate,
      isCustom: true
    }));

    const allPopular = [...formattedAdmin, ...tmdbPopular];

    res.status(200).json({
      message: "Popular movies fetched",
      movies: allPopular
    });

  } catch (err) {
    next(err);
  }
};

const handleSearchMovies = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    let tmdbMovies = [];

    try {
      const response = await axios.get(
        `${process.env.TMDB_BASE_URL}/search/movie`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            query: query
          },
          timeout: 5000
        }
      );

      tmdbMovies = response.data.results;

    } catch (apiError) {
      console.error("TMDB Search Error:", apiError.message);
      tmdbMovies = [];
    }

    const adminMovies = await adminMovieModel.find({
      title: { $regex: query, $options: "i" } // 🔥 case-insensitive search
    });

    const formattedAdminMovies = adminMovies.map(movie => ({
      id: movie._id,
      title: movie.title,
      overview: movie.description,
      poster_path: movie.image,
      release_date: movie.releaseDate,
      genre: movie.genre,
      category: movie.category,
      isCustom: true
    }));

    const allMovies = [...formattedAdminMovies, ...tmdbMovies];

    res.status(200).json({
      message: "Search results fetched successfully",
      movies: allMovies
    });

  } catch (err) {
    next(err);
  }
};

const handleGetMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY
      }
    });

    res.status(200).json({
      msg: "Movie details fetched successfully.",
      movie: response.data
    });
  } catch (err) {
    next(err);
  }
}

const handleGetMovieVideos = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await adminMovieModel.findById(id);

    if (movie) {
      movie.views += 1;

      if (movie.views >= 5) {
        movie.trending = true;
      }

      if (movie.views >= 10) {
        movie.popular = true;
      }

      await movie.save();

      return res.status(200).json({
        message: "Admin movie fetched",
        movie
      });
    }

    const response = await axios.get(`${process.env.TMDB_BASE_URL}/movie/${id}/videos`, {
      params: {
        api_key: process.env.TMDB_API_KEY
      }
    });

    res.status(200).json({
      msg: "Movie video fetched successfully.",
      movie: response.data.results
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleAllMovies,
  handleGetTrendingMovies,
  handleGetPopularMovies,
  handleSearchMovies,
  handleGetMovieDetails,
  handleGetMovieVideos
}
