'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const baseRouter = new Router();
const {prepareErrors} = require(`./../../utils/utils`);
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);

const ARTICLES_PER_PAGE = 8;

const api = getAPI();

baseRouter.get(URL.BASE, async (request, response) => {
  let {page = 1} = request.query;
  page += page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  response.render(`main`, {articles, page, totalPages, categories});
});

baseRouter.get(URL.LOGIN, (request, response) => response.render(`login`));
baseRouter.get(URL.REGISTER, (request, response) => response.render(`sign-up`));
baseRouter.get(URL.CATEGORY, (request, response) => response.render(`all-categories`));
baseRouter.get(URL.MY, async (request, response) => {
  const articles = await api.getArticles({limit: 1, offset: 1});
  response.render(`my`, {articles});
});
baseRouter.get(URL.SEARCH, async (request, response) => {
  const {query} = request.query;
  try {
    const searchResult = await api.search(query);
    response.render(`search`, {searchResult: searchResult.slice(0, 4), query});
  } catch (error) {
    response.render(`search-no-result`, {query});
  }
});

baseRouter.post(URL.REGISTER, upload.single(`avatar`), async (request, response) => {
  const {body, file} = request;
  const userData = {
    avatar: file ? file.filename : ``,
    name: `${body[`first-name`]} ${body[`last-name`]}`,
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    response.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    response.render(`sign-up`, {validationMessages});
  }
});

module.exports = baseRouter;
