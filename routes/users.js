const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe, updateUser,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = userRouter;
