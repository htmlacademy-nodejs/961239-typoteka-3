'use strict';

const Joi = require(`joi`);
const {StatusCode, ValidationMessages} = require(`./../../constants`);

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ValidationMessages.COMMENT.TEXT_MIN
  })
});

module.exports = (request, response, next) => {
  const comment = request.body;
  const {error} = schema.validate(comment, {abortEarly: false});
  if (error) {
    return response.status(StatusCode.BADREQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
