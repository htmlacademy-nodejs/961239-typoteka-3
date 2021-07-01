'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const myRouter = new Router();
const {getAPI} = require(`./../api`);

const api = getAPI();

myRouter.get(URL.MYURLS.COMMENTS, async (request, response) => {
  const articles = await api.getArticles();
  response.render(`comments`, {articles});
});

module.exports = myRouter;
