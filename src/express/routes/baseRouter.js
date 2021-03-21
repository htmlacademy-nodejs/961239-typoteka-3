'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const baseRouter = new Router();

baseRouter.get(URL.BASE, (request, response) => response.send(URL.BASE));
baseRouter.get(URL.LOGIN, (request, response) => response.send(URL.LOGIN));
baseRouter.get(URL.REGISTER, (request, response) => response.send(URL.REGISTER));
baseRouter.get(URL.CATEGORY, (request, response) => response.sebd(URL.CATEGORIES));
baseRouter.get(URL.MY, (request, response) => response.send(URL.MY));
baseRouter.get(URL.SEARCH, (request, response) => response.send(URL.SEARCH));

module.exports = baseRouter;
