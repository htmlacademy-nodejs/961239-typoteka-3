'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const myRouter = new Router();

myRouter.get(URL.MYURLS.COMMENTS, (request, response) => response.render(`comments`));

module.exports = myRouter;
