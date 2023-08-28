const express = require('express');

const router = express();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const { login, createUser } = require('../controllers/users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
