const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[a-z1-90.,_@%&?+=~/-]{1,}\/?)?#?/i.test(value);
      },
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[a-z1-90.,_@%&?+=~/-]{1,}\/?)?#?/i.test(value);
      },
    },
  },

  nameRU: {
    required: true,
    type: String,
  },

  nameEN: {
    required: true,
    type: String,
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i.test(value);
      },
    },
  },

  movieId: {
    required: true,
    type: Number,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

});

module.exports = mongoose.model('movie', movieSchema);
