'use strict';

const Joi = require(`joi`);
const {StatusCode, ValidationMessages} = require(`./../../constants`);

const schema = Joi.object({
  firstName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ValidationMessages.USER.NAME,
    'any.required': ValidationMessages.USER.NAME_REQUIRED
  }),
  lastName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ValidationMessages.USER.NAME,
    'any.required': ValidationMessages.USER.NAME_REQUIRED
  }),
  email: Joi.string().email().required().messages({
    'string.email': ValidationMessages.USER.EMAIL,
    'any.required': ValidationMessages.USER.EMAIL_REQUIRED
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ValidationMessages.USER.PASSWORD,
    'any.required': ValidationMessages.USER.PASSWORD_REQUIRED
  }),
  passwordRepeated: Joi.string().valid(Joi.ref(`password`)).messages({
    'any.only': ValidationMessages.USER.PASSWORD_REPEATED
  }),
  avatar: Joi.string().pattern(/\.(jpe?g|png)$/i).messages({
    'string.pattern.base': ValidationMessages.USER.AVATAR,
  })
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(StatusCode.BADREQUEST)
      .send(error.details.map((err) => {
        return err.message;
      }));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(StatusCode.CONFLICT)
      .send(ValidationMessages.USER.EMAIL_EXIST);
  }

  return next();
};
