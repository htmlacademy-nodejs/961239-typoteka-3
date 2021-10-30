'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const myRouter = new Router();
const {getAPI} = require(`./../api`);

const api = getAPI();

myRouter.get(URL.MYURLS.COMMENTS, async (request, response) => {
  const articles = await api.getArticles({comments: true});
  response.render(`user/my`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
