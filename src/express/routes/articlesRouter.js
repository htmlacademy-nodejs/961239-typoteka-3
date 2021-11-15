'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const articlesRouter = new Router();
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);
const csrf = require(`csurf`);
const auth = require(`./../middlewares/auth`);

const api = getAPI();

const csrfProtection = csrf({cookie: true});

const collectCategories = async (body) => {
  const categories = await api.getCategories();
  const selectedCategories = [];
  categories.forEach((category) => {
    if (body[`category-${category.id}`]) {
      selectedCategories.push(category.id);
    }
  });
  return selectedCategories;
};

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

articlesRouter.get(URL.ARTICLESURL.CATEGORY, async (request, response) => {
  const categories = await api.getCategories();
  response.render(`articles/articles-by-category`, {categories});
});

articlesRouter.get(URL.ARTICLESURL.ADD, auth, csrfProtection, async (request, response) => {
  const categories = await getAddArticleData();
  response.render(`articles/new-post`, {categories, csrfToken: request.csrfToken()});
});

articlesRouter.get(URL.ARTICLESURL.EDIT, auth, csrfProtection, async (request, response) => {
  const {id} = request.params;
  const [article, categories] = await getEditArticleData(id);
  response.render(`articles/edit-post`, {article, categories, id, csrfToken: request.csrfToken()});
});

articlesRouter.get(URL.ARTICLESURL.ID, csrfProtection, async (request, response) => {
  const {id} = request.params;
  const {user} = request.session;
  const article = await api.getArticle(request.params.id, true);
  response.render(`articles/post`, {article, id, user, csrfToken: request.csrfToken()});
});

articlesRouter.post(URL.ARTICLESURL.ADD, auth, upload.single(`upload`), csrfProtection, async (request, response) => {
  const {body, file} = request;
  const articleData = {
    image: file ? file.filename : null,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: await collectCategories(body)
  };

  try {
    await api.createArticle(articleData);
    response.redirect(URL.MY);
  } catch (errors) {
    const categories = await getAddArticleData();
    response.render(`articles/new-post`, {categories, errors, article: articleData});
  }
});

articlesRouter.post(URL.ARTICLESURL.EDIT, auth, upload.single(`upload`), csrfProtection, async (request, response) => {
  const {body, file} = request;
  const {id} = request.params;
  const articleData = {
    image: file ? file.filename : null,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: await collectCategories(body)
  };

  try {
    await api.editArticle(articleData, id);
    response.redirect(`${URL.ARTICLESURL}/${id}`);
  } catch (errors) {
    const categories = await getAddArticleData();
    response.render(`articles/edit-post`, {categories, errors, article: articleData, id});
  }
});

articlesRouter.post(URL.ARTICLESURL.COMMENTS, auth, async (request, response) => {
  const {user} = request.session;
  const {id} = request.params;
  const {message} = request.body;
  try {
    await api.createComment(id, {userId: user.id, message});
    response.redirect(`${URL.ARTICLES}/${id}`);
  } catch (errors) {
    const article = await api.getArticle(request.params.id, true);
    response.render(`articles/post`, {article, errors, id, user});
  }
});

module.exports = articlesRouter;
