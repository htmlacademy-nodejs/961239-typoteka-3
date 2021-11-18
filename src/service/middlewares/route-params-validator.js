'use strict';

const Joi = require(`joi`);
const {StatusCode} = require(`./../../constants`);

const schema = Joi.object({
  articleId: Joi.number().integer().min(1)
});

module.exports = (request, response, next) => {
  const params = request.params;
  const {error} = schema.validate(params);
  if (error) {
    return response.status(StatusCode.BADREQUEST)
      .send(error.details.map((err) => err.message));
  }

  return next();
};
