'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../../service/constants`);
const articlesRouter = new Router();
const {getAPI} = require(`./../api`);
const upload = require(`./../storage`);

const api = getAPI();

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

articlesRouter.get(`${URL.ARTICLESURL.CATEGORY}/:id`, (request, response) =>
  response.render(`articles-by-category`));
articlesRouter.get(URL.ARTICLESURL.ADD, async (request, response) => {
  const categories = await api.getCategories();
  response.render(`new-post`, {categories});
});

articlesRouter.get(`${URL.ARTICLESURL.EDIT}/:id`, async (request, response) => {
  const article = await api.getArticle(request.params.id);
  const categories = await api.getCategories();
  response.render(`edit-post`, {article, categories});
});

articlesRouter.get(URL.ARTICLESURL.ID, async (request, response) => {
  const article = await api.getArticle(request.params.id);
  response.render(`post`, {article});
});

articlesRouter.post(URL.ARTICLESURL.ADD, upload.single(`upload`), async (request, response) => {
  const {body, file} = request;
  const articleData = {
    image: file ? file.filename : null,
    createDate: body.date,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: await collectCategories(body)
  };

  let redirectURI = URL.MY;
  try {
    await api.createArticle(articleData);
  } catch (err) {
    redirectURI = `back`;
  }
  response.redirect(redirectURI);
});

module.exports = articlesRouter;
