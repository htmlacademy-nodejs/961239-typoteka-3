'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const articlesRouter = new Router();

articlesRouter.get(`${URL.ARTICLESURL.CATEGORY}/:id`, (request, response) =>
  response.send(`${URL.ARTICLES}${URL.ARTICLESURL.CATEGORY}/${Number.parseInt(request.params.id, 10)}`));
articlesRouter.get(URL.ARTICLESURL.ADD, (request, response) => response.send(`${URL.ARTICLES}${URL.ARTICLESURL.ADD}`));
articlesRouter.get(`${URL.ARTICLESURL.EDIT}/:id`, (request, response) =>
  response.send(`${URL.ARTICLES}${URL.ARTICLESURL.EDIT}/${Number.parseInt(request.params.id, 10)}`));

articlesRouter.get(URL.ARTICLESURL.ID, (request, response) => response.send(`${URL.ARTICLES}/${Number.parseInt(request.params.id, 10)}`));

module.exports = articlesRouter;
