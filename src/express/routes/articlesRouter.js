'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../constants`);
const {prepareErrors} = require(`./../../utils/utils`);
const articlesRouter = new Router();
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);
const csrf = require(`csurf`);

const api = getAPI();

const csrfProtection = csrf({cookie: true});

const collectCategories = async (body) => {
  const categories = await api.getCategories();
  const selectedCategories = [];
  categories.forEach((elem, index) => {
    if (body[`category-${index}`]) {
      selectedCategories.push(elem);
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

articlesRouter.get(URL.ARTICLESURL.CATEGORY, (request, response) =>
  response.render(`articles/articles-by-category`));

articlesRouter.get(URL.ARTICLESURL.ADD, csrfProtection, async (request, response) => {
  const categories = await getAddArticleData();
  response.render(`articles/new-post`, {categories, csrfToken: request.csrfToken()});
});

articlesRouter.get(URL.ARTICLESURL.EDIT, csrfProtection, async (request, response) => {
  const {id} = request.params;
  const [article, categories] = await getEditArticleData(id);
  response.render(`articles/edit-post`, {article, categories, id, csrfToken: request.csrfToken()});
});

articlesRouter.get(URL.ARTICLESURL.ID, async (request, response) => {
  const {id} = request.params;
  const article = await api.getArticle(request.params.id, true);
  response.render(`articles/post`, {article, id});
});

articlesRouter.post(URL.ARTICLESURL.ADD, upload.single(`upload`), csrfProtection, async (request, response) => {
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
    const allValidationMessages = prepareErrors(errors);
    const categories = getAddArticleData();
    response.render(`articles/new-post`, {categories, allValidationMessages, article: articleData});
  }
});

articlesRouter.post(URL.ARTICLESURL.EDIT, upload.single(`upload`), csrfProtection, async (request, response) => {
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
    const allValidationMessages = prepareErrors(errors);
    const categories = getAddArticleData();
    response.render(`articles/edit-post`, {categories, allValidationMessages, article: articleData, id});
  }
});

articlesRouter.post(URL.ARTICLESURL.COMMENTS, async (request, response) => {
  const {id} = request.params;
  const {message} = request.body;
  try {
    await api.createComment(id, {text: message});
    response.redirect(URL.ARTICLESURL.ID);
  } catch (errors) {
    const allValidationMessages = prepareErrors(errors);
    const article = await api.getArticle(request.params.id, true);
    response.render(`articles/post`, {article, allValidationMessages, id});
  }
});

module.exports = articlesRouter;
