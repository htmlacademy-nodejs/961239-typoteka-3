'use strict';

const {Router} = require(`express`);
const {URL, StatusCode} = require(`./../../constants`);

const userValidator = require(`./../middlewares/user-validator`);

const passwordUtils = require(`./../lib/password`);

const route = new Router();

module.exports = (app, service) => {
  app.use(URL.API.USERROUTE, route);
  console.log(service);
  route.post(URL.API.BASEROUTE, userValidator(service), async (request, response) => {
    const data = request.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    response.status(StatusCode.CREATED)
      .json(result);
  });
};
