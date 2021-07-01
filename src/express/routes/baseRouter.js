'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const baseRouter = new Router();
const {getAPI} = require(`./../api`);

const api = getAPI();

baseRouter.get(URL.BASE, async (request, response) => {
  const articles = await api.getArticles();
  response.render(`main`, {articles});
});
baseRouter.get(URL.LOGIN, (request, response) => response.render(`login`));
baseRouter.get(URL.REGISTER, (request, response) => response.render(`sign-up`));
baseRouter.get(URL.CATEGORY, (request, response) => response.render(`all-categories`));
baseRouter.get(URL.MY, async (request, response) => {
  const articles = await api.getArticles();
  response.render(`my`, {articles});
});
baseRouter.get(URL.SEARCH, async (request, response) => {
  const {query} = request.query;
  try {
    const searchResult = await api.search(query);
    response.render(`search`, {searchResult: searchResult.slice(0, 4), query});
  } catch (error) {
    response.render(`search-no-result`, {query});
  }
});

module.exports = baseRouter;
