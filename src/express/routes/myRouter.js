'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const myRouter = new Router();
const {getAPI} = require(`./../api`);
const {auth, isAuthorAuth} = require(`./../middlewares/auth`);

const api = getAPI();

myRouter.get(URL.BASE, isAuthorAuth, async (request, response) => {
  const articles = await api.getArticles({comments: true});
  response.render(`my/my`, {articles: articles.slice(0, 3)});
});

myRouter.get(URL.MYURLS.COMMENTS, isAuthorAuth, async (request, response) => {
  const articles = await api.getArticles({comments: true});
  response.render(`my/comments`, {articles});
});

module.exports = myRouter;
