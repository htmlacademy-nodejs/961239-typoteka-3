'use strict';

const Joi = require(`joi`);
const {StatusCode, ValidationMessages} = require(`./../../constants`);

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ValidationMessages.ARTICLE.CATEGORY_INVALID
      })
  ).min(1).required().messages({
    'array.min': ValidationMessages.ARTICLE.CATEGORY_REQUIRED
  }),
  title: Joi.string().required().min(30).max(250).messages({
    'string.min': ValidationMessages.ARTICLE.TITLE_MIN,
    'string.max': ValidationMessages.ARTICLE.TITLE_MAX,
    'string.empty': ValidationMessages.ARTICLE.TITLE_MIN
  }),
  announce: Joi.string().required().min(30).max(250).messages({
    'string.min': ValidationMessages.ARTICLE.ANNOUNCE_MIN,
    'string.max': ValidationMessages.ARTICLE.ANNOUNCE_MAX,
    'string.empty': ValidationMessages.ARTICLE.ANNOUNCE_MIN
  }),
  fullText: Joi.string().empty(``).max(1000).messages({
    'string.max': ValidationMessages.ARTICLE.FULLTEXT_MAX
  }),
  image: Joi.string().allow(null).pattern(/.*\.jpg|\.jpeg|\.png$/i)
  .messages({'string.pattern.base': ValidationMessages.ARTICLE.IMAGE}),
  createDate: Joi.string().required().messages({
    'string.empty': ValidationMessages.ARTICLE.DATE_EMPTY
  })
});

module.exports = (request, response, next) => {
  const article = request.body;
  const {error} = schema.validate(article, {abortEarly: false});
  if (error) {
    return response.status(StatusCode.BADREQUEST)
      .send(error.details.map((err) => err.message));
  }

  return next();
};
