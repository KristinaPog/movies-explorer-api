require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const Router = require('./routes/index');
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
app.use(helmet());
app.use(cors(allowedCors));
app.use(requestLogger);
app.use(Router);
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
