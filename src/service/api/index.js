'use strict';

const {Router} = require(`express`);
const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService} = require(`./../data-service`);
const {readData} = require(`./../lib/get-mock-data`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const app = new Router();

(async () => {
  const readingData = await readData();

  category(app, new CategoryService(readingData));
  article(app, new ArticleService(readingData), new CommentService(readingData));
  search(app, new SearchService(readingData));
})();

module.exports = app;
