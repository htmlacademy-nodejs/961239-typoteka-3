'use strict';

const {Router} = require(`express`);
const {URL, StatusCode} = require(`./../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(URL.API.SEARCHROUTE, route);

  route.get(URL.API.BASEROUTE, async (request, response) => {
    const {query = ``} = request.query;
    if (!query) {
      response.status(StatusCode.BADREQUEST).json({});
      return;
    }
    const searchResults = await service.findAll(query);
    const searchStatus = searchResults.length > 0 ? StatusCode.OK : StatusCode.NOTFOUND;
    response.status(searchStatus)
        .json(searchResults);
  });
};
