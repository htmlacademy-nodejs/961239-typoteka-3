'use strict';

const {Router} = require(`express`);
const {URL, TypeOfLimits} = require(`./../../constants`);
const baseRouter = new Router();
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);
const {alreadyAuth, isAuthorAuth} = require(`./../middlewares/auth`);

const ARTICLES_PER_PAGE = 8;
const HOTTEST_ARTICLES_COUNT = 4;
const LATEST_COMMENTS_COUNT = 4;

const CategoryErrorSource = {
  ADD: `add`,
  EDIT: `edit-`
};

const api = getAPI();

baseRouter.get(URL.BASE, async (request, response) => {
  const {user} = request.session;
  let {page = 1} = request.query;
  page = parseInt(page, 10);
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const {count, articles} = await api.getArticles({limit: ARTICLES_PER_PAGE, offset, type: TypeOfLimits.PAGE});
  const categories = await api.getCategories(true);
  const {articles: hotArticles} = await api.getArticles({limit: HOTTEST_ARTICLES_COUNT, type: TypeOfLimits.HOTTEST});
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const {comments} = await api.getLatestComments(LATEST_COMMENTS_COUNT);
  response.render(`main`, {user, articles, hotArticles, comments, page, totalPages, categories});
});

baseRouter.get(URL.LOGIN, alreadyAuth, (request, response) => response.render(`register-and-login/login`));

baseRouter.get(URL.REGISTER, alreadyAuth, (request, response) => response.render(`register-and-login/sign-up`));

baseRouter.get(URL.CATEGORY, isAuthorAuth, async (request, response) => {
  const categories = await api.getCategories(false);
  const {user} = request.session;
  response.render(`categories/categories`, {categories, user});
});

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

baseRouter.post(URL.CATEGORY, isAuthorAuth, async (request, response) => {
  const {body} = request;
  const categoryData = {name: body[`add-category`]};
  try {
    await api.createCategory(categoryData);
    response.redirect(URL.CATEGORY);
  } catch (errors) {
    const {user} = request.session;
    const categories = await api.getCategories(false);
    response.render(`categories/categories`, {categories, user, errors: errors.response.data, errorsSource: CategoryErrorSource.ADD});
  }
});

baseRouter.post(URL.EDIT_CATEGORY, isAuthorAuth, async (request, response) => {
  const {body} = request;
  const {id} = request.params;
  const categoryData = {name: body[`category-${id}`]};
  try {
    await api.updateCategory({id, categoryData});
    response.redirect(URL.CATEGORY);
  } catch (errors) {
    const {user} = request.session;
    const categories = await api.getCategories(false);
    response.render(`categories/categories`, {categories, user, errors: errors.response.data, errorsSource: `${CategoryErrorSource.EDIT}${id}`});
  }
});

baseRouter.get(URL.DELETE_CATEGORY, isAuthorAuth, async (request, response) => {
  const {id} = request.params;
  await api.deleteCategory(id);
  response.redirect(URL.CATEGORY);
});

baseRouter.post(URL.REGISTER, upload.single(`upload`), async (request, response) => {
  const {body, file} = request;
  const userData = {
    avatar: file ? file.filename : null,
    firstName: body[`first-name`],
    lastName: body[`last-name`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    response.redirect(URL.LOGIN);
  } catch (errors) {
    response.render(`register-and-login/sign-up`, {errors: errors.response.data});
  }
});

baseRouter.post(URL.LOGIN, async (request, response) => {
  try {
    const {email, password} = request.body;
    const user = await api.auth(email, password);
    request.session.user = user;
    request.session.save(() => {
      response.redirect(`/`);
    });
  } catch (errors) {
    response.render(`register-and-login/login`, {email: request.body.email, errors: errors.response.data});
  }
});

baseRouter.get(`/logout`, (request, response) => {
  delete request.session.user;
  response.redirect(`/`);
});

module.exports = baseRouter;
