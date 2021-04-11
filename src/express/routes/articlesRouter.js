'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const articlesRouter = new Router();

articlesRouter.get(`${URL.ARTICLESURL.CATEGORY}/:id`, (request, response) =>
  response.render(`articles-by-category`));
articlesRouter.get(URL.ARTICLESURL.ADD, (request, response) => response.render(`new-post`));
articlesRouter.get(`${URL.ARTICLESURL.EDIT}/:id`, (request, response) =>
  response.render(`post`));

articlesRouter.get(URL.ARTICLESURL.ID, (request, response) => response.render(`post`));

module.exports = articlesRouter;
