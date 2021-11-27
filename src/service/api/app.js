'use strict';

const {Router} = require(`express`);
const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService} = require(`./../data-service`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);
const user = require(`./user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
