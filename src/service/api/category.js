'use strict';

const {Router} = require(`express`);
const {URL, StatusCode, ServerMessages} = require(`./../../constants`);
const categoryValidator = require(`./../middlewares/category-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(URL.API.CATEGORIESROUTE, route);

  route.get(URL.API.BASEROUTE, async (request, response) => {
    const {withArticles} = request.query;
    const categories = await service.findAll(withArticles === `true`);
    response.status(StatusCode.OK)
      .json(categories);
  });

  route.post(URL.API.BASEROUTE, categoryValidator(service), async (request, response) => {
    const category = request.body;
    await service.create(category);
    const categories = await service.findAll(false);
    response.status(StatusCode.CREATED)
      .json(categories);
  });

  route.put(URL.API.CATEGORIESID, categoryValidator(service), async (request, response) => {
    const category = request.body;
    const {categoryId} = request.params;
    const updatedCategory = await service.update(categoryId, category);
    if (!updatedCategory) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND_CATEGORY);
    }
    const updatedCategoriesList = await service.findAll(false);
    return response.status(StatusCode.OK)
      .json(updatedCategoriesList);
  });

  route.delete(URL.API.CATEGORIESID, async (request, response) => {
    const {categoryId} = request.params;
    const deletedCategory = await service.delete(categoryId);
    if (!deletedCategory) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND_CATEGORY);
    }
    return response.status(StatusCode.OK)
      .json(ServerMessages.CATEGORY_DELETE);
  });
};


