const mongoose = require("mongoose");

const adminMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    unique: [true, "Title is already used."]
  },
  description: {
    type: String,
    required: [true, "Description is required."]
  },
  image: {
    type: String,
    required: [true, "Image is required."]
  },
  releaseDate: {
    type: String,
    required: [true, "Release date is required."]
  },
  link: {
    type: String,
    required: [true, "Link is required."]
  },
  genre: {
    type: String,
    enum: [
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Horror",
      "Romance",
      "Sci-Fi",
      "Thriller",
      "Animation"
    ],
    required: [true, "Genre is required."]
  },
  category: {
    type: String,
    enum: ["movie", "series", "anime"],
    required: [true, "Category is required."]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required."]
  },
  views: {
    type: Number,
    default: 0
  },
  trending: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const adminMovieModel = mongoose.model("movie", adminMovieSchema);

module.exports = adminMovieModel;
