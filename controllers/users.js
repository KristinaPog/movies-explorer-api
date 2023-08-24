const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
} = require('../errors/errors');

const BadRequest = require('../errors/badRequest');
const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notFound');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(STATUS_CODE_CREATED).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch(
      (err) => {
        if (err.name === 'ValidationError') { next(new BadRequest('Переданы некорректные данные при создании пользователя')); } else if (err.code === 11000) { next(new Conflict('Ошибка сервера')); } else { next(err); }
      },
    );
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.status(STATUS_CODE_OK).send({ token });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => { next(new NotFound('Пользователь по указанному _id не найден')); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => { next(err); });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { next(new NotFound('Пользователь по указанному _id не найден')); })
    .then((user) => res.status(STATUS_CODE_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') { next(new BadRequest('Переданы некорректные данные при обновлении профиля')); } else { next(err); }
    });
};
