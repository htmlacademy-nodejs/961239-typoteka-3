'use strict';

const {Router} = require(`express`);
const {URL, TypeOfLimits} = require(`./../../constants`);
const baseRouter = new Router();
const {prepareErrors} = require(`./../../utils/utils`);
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);
const auth = require(`./../middlewares/auth`);

const ARTICLES_PER_PAGE = 8;
const HOTTEST_ARTICLES_PER_PAGE = 4;

const api = getAPI();

baseRouter.get(URL.BASE, async (request, response) => {
  const {user} = request.session;

  let {page = 1} = request.query;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  console.log(`LIMIT: `, ARTICLES_PER_PAGE, `, OFFSET: `, offset);
  const {count, articles: allArticles} = await api.getArticles({limit: ARTICLES_PER_PAGE, offset, type: TypeOfLimits.PAGE});
  const categories = await api.getCategories(true);
  const {articles: hotArticles} = await api.getArticles({limit: HOTTEST_ARTICLES_PER_PAGE, type: TypeOfLimits.HOTTEST});
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  console.log(allArticles);
  response.render(`main`, {user, allArticles, hotArticles, page, totalPages, categories});
});

baseRouter.get(URL.LOGIN, (request, response) => response.render(`register-and-login/login`));
baseRouter.get(URL.REGISTER, (request, response) => response.render(`register-and-login/sign-up`));
baseRouter.get(URL.CATEGORY, auth, (request, response) => response.render(`articles/all-categories`));
baseRouter.get(URL.SEARCH, async (request, response) => {
  const {query} = request.query;
  const user = request.session.user;
  try {
    const searchResult = await api.search(query);
    response.render(`search/search`, {searchResult: searchResult.slice(0, 4), query, user});
  } catch (error) {
    response.render(`search/search-no-result`, {query, user});
  }
});

baseRouter.post(URL.REGISTER, upload.single(`upload`), async (request, response) => {
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
    response.redirect(URL.LOGIN);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    response.render(`register-and-login/sign-up`, {validationMessages});
  }
});

baseRouter.post(`/login`, async (request, response) => {
  try {
    const {email, password} = request.body;
    const user = await api.auth(email, password);
    request.session.user = user;
    request.session.save(() => {
      response.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = request.session;
    response.render(`register-and-login/login`, {user, validationMessages});
  }
});

baseRouter.get(`/logout`, (request, response) => {
  delete request.session.user;
  response.redirect(`/`);
});

module.exports = baseRouter;
