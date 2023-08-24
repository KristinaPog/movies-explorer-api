const Movie = require('../models/movie');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
} = require('../errors/errors');

const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(STATUS_CODE_OK).send(movies);
    })
    .catch((err) => { next(err); });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(STATUS_CODE_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new BadRequest('Переданы некорректные данные при создании фильма')); } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      next(new NotFound('Фильм не найден'));
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        Movie.deleteOne(movie)
          .then(() => {
            res.status(STATUS_CODE_OK).send(movie);
          })
          .catch(next);
      } else {
        next(new Forbidden('Данный фильм добавлен другим пользователем'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Неверный запрос'));
      } else {
        next(err);
      }
    });
};
