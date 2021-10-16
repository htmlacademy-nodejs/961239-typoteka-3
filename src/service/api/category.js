'use strict';

const {Router} = require(`express`);
const {URL, StatusCode} = require(`./../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(URL.API.CATEGORIESROUTE, route);

  route.get(URL.API.BASEROUTE, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(StatusCode.OK)
      .json(categories);
  });
};
