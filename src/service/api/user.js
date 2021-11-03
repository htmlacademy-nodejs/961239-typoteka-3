'use strict';

const {Router} = require(`express`);
const {URL, StatusCode, ValidationMessages} = require(`./../../constants`);

const userValidator = require(`./../middlewares/user-validator`);

const passwordUtils = require(`./../lib/password`);

const route = new Router();

module.exports = (app, service) => {
  app.use(URL.API.USERROUTE, route);
  route.post(URL.API.BASEROUTE, userValidator(service), async (request, response) => {
    const data = request.body;

    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    response.status(StatusCode.CREATED)
      .json(result);
  });

  route.post(URL.API.AUTHROUTE, async (request, response) => {
    console.log(request.body);
    const {email, password} = request.body;
    const user = await service.findByEmail(email);

    if (!user) {
      response.status(StatusCode.UNAUTHORIZED).send(ValidationMessages.LOGIN.EMAIL_NOT_EXIST);
      return;
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

    if (passwordIsCorrect) {
      delete user.passwordHash;
      response.status(StatusCode.OK).json(user);
    } else {
      response.status(StatusCode.UNAUTHORIZED).send(ValidationMessages.LOGIN.PASSWORD_NOT_MATCH);
    }
  });
};
