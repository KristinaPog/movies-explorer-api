require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRouter = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { STATUS_CODE_DEFAULT_ERROR } = require('./errors/errors');
const NotFound = require('./errors/notFound');

const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://pogodina.nomoredomainsicu.ru',
];
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
app.use(express.json());
app.use(cors(allowedCors));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);
app.use(auth);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('*', (req, res, next) => {
  next(new NotFound({ message: 'Страница не найдена' }));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else { res.status(STATUS_CODE_DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' }); }
  next();
});

app.listen(PORT);
