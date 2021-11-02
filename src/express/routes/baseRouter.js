'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const baseRouter = new Router();
const {prepareErrors} = require(`./../../utils/utils`);
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);
const auth = require(`./../middlewares/auth`);

const ARTICLES_PER_PAGE = 8;

const api = getAPI();

baseRouter.get(URL.BASE, async (request, response) => {
  const {user} = request.session;
  const limit = ARTICLES_PER_PAGE;

  let {page = 1} = request.query;
  page += page;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  response.render(`main`, {user, articles, page, totalPages, categories});
});

baseRouter.get(URL.LOGIN, (request, response) => response.render(`register-and-login/login`));
baseRouter.get(URL.REGISTER, (request, response) => response.render(`register-and-login/sign-up`));
baseRouter.get(URL.CATEGORY, auth, (request, response) => response.render(`articles/all-categories`));
baseRouter.get(URL.MY, async (request, response) => {
  const articles = await api.getArticles({limit: 1, offset: 1});
  response.render(`my`, {articles});
});
baseRouter.get(URL.SEARCH, async (request, response) => {
  const {query} = request.query;
  try {
    const searchResult = await api.search(query);
    response.render(`search/search`, {searchResult: searchResult.slice(0, 4), query});
  } catch (error) {
    response.render(`search/search-no-result`, {query});
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
    response.redirect(`register-and-login/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    response.render(`register-and-login/sign-up`, {validationMessages});
  }
});

baseRouter.post(`/login`, async (request, response) => {
  try {
    console.log(request.body);
    const {email, password} = request.body;
    const user = await api.auth(email, password);
    request.session.user = user;
    request.session.save(() => {
      response.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = request.session;
    response.render(`login`, {user, validationMessages});
  }
});

baseRouter.get(`/logout`, (request, response) => {
  delete request.session.user;
  response.redirect(`/`);
});

module.exports = baseRouter;
