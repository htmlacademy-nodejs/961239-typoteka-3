'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const myRouter = new Router();

myRouter.get(URL.MYURLS.COMMENTS, (request, response) => response.send(`${URL.MY}${URL.MYURLS.COMMENTS}`));

module.exports = myRouter;
