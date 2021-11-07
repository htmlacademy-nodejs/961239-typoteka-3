'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const myRouter = new Router();
const {getAPI} = require(`./../api`);
const auth = require(`./../middlewares/auth`);

const api = getAPI();

myRouter.get(URL.BASE, auth, async (request, response) => {
  const articles = await api.getArticles({comments: true});
  response.render(`user/my`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
