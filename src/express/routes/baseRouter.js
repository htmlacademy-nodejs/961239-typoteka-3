'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const baseRouter = new Router();

baseRouter.get(URL.BASE, (request, response) => response.render(`main`));
baseRouter.get(URL.LOGIN, (request, response) => response.render(`login`));
baseRouter.get(URL.REGISTER, (request, response) => response.render(`sign-up`));
baseRouter.get(URL.CATEGORY, (request, response) => response.render(`all-categories`));
baseRouter.get(URL.MY, (request, response) => response.render(`my`));
baseRouter.get(URL.SEARCH, (request, response) => response.render(`search`));

module.exports = baseRouter;