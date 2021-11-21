'use strict';

const Joi = require(`joi`);
const {StatusCode, ValidationMessages} = require(`./../../constants`);

const schema = Joi.object({
  name: Joi.string().required().min(5).max(30).messages({
    'string.min': ValidationMessages.CATEGORY.NAME_MIN,
    'string.max': ValidationMessages.CATEGORY.NAME_MAX,
    'string.empty': ValidationMessages.CATEGORY.NAME_MIN
  })
});

module.exports = (service) => async (req, res, next) => {
  const category = req.body;
  const {error} = schema.validate(category, {abortEarly: false});
  if (error) {
    return res.status(StatusCode.BADREQUEST)
      .send(error.details.map((err) => {
        return err.message;
      }));
  }

  const categoryByName = await service.findByName(req.body.name);

  if (categoryByName) {
    return res.status(StatusCode.CONFLICT)
      .send(ValidationMessages.CATEGORY.CATEGORY_EXIST);
  }

  return next();
};
