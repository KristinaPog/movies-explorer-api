const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe, updateUser,
} = require('../controllers/users');

userRouter.get('/me', getMe);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
  }),
}), updateUser);

module.exports = userRouter;
