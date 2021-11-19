'use strict';

const {Router} = require(`express`);
const {URL, TypeOfLimits} = require(`./../../constants`);
const myRouter = new Router();
const {getAPI} = require(`./../api`);
const {isAuthorAuth} = require(`./../middlewares/auth`);

const api = getAPI();

myRouter.get(URL.BASE, isAuthorAuth, async (request, response) => {
  const user = request.session.user;
  const articles = await api.getArticles({});
  response.render(`my/my`, {articles, user});
});

myRouter.get(URL.MYURLS.COMMENTS, isAuthorAuth, async (request, response) => {
  const user = request.session.user;
  const articles = await api.getArticles({type: TypeOfLimits.COMMENTS});
  response.render(`my/comments`, {articles, user});
});

myRouter.use((req, res) => {
  res.status(404).render(`errors/404`);
});

module.exports = myRouter;
