'use strict';

const {Router} = require(`express`);
const {URL, TypeOfLimits} = require(`./../../constants`);
const articlesRouter = new Router();
const {getAPI} = require(`./../api`);
const upload = require(`./../middlewares/upload`);
const csrf = require(`csurf`);
const {auth, isAuthorAuth} = require(`./../middlewares/auth`);

const api = getAPI();

const csrfProtection = csrf({cookie: true});

const CATEGORY_ARTICLES_PER_PAGE = 8;

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
  return {article, categories};
};

articlesRouter.get(URL.ARTICLESURL.CATEGORY, async (request, response) => {
  const {id} = request.params;
  const {user} = request.session;
  const categories = await api.getCategories(true);
  const articles = await api.getCategoryArticles({id, limit: CATEGORY_ARTICLES_PER_PAGE, type: TypeOfLimits.CATEGORIES});
  const activeCategory = categories.find((category) => category.id === parseInt(id, 10));
  response.render(`articles/articles-by-category`, {
    activeCategoryId: activeCategory.id, activeCategoryName: activeCategory.name, categories, articles, user
  });
});

articlesRouter.get(URL.ARTICLESURL.ADD, isAuthorAuth, csrfProtection, async (request, response) => {
  const {user} = request.session;
  const categories = await getAddArticleData();
  response.render(`articles/new-post`, {categories, csrfToken: request.csrfToken(), user});
});

articlesRouter.get(URL.ARTICLESURL.EDIT, isAuthorAuth, csrfProtection, async (request, response) => {
  try {
    const {id} = request.params;
    const {user} = request.session;
    const {article, categories} = await getEditArticleData(id);
    response.render(`articles/edit-post`, {article, categories, id, csrfToken: request.csrfToken(), user});
  } catch (error) {
    response.status(404).render(`errors/404`);
  }
});

articlesRouter.get(URL.ARTICLESURL.ID, csrfProtection, async (request, response) => {
  try {
    const {id} = request.params;
    const {user} = request.session;
    console.log(request.headers.referer.includes(request.originalUrl));
    if (!request.headers.referer.includes(request.originalUrl)) {
      request.session.path = request.headers.referer;
    }
    const article = await api.getArticle(request.params.id, true);
    response.render(`articles/post`, {article, id, user, csrfToken: request.csrfToken(), backHistory: request.session.path});
  } catch (error) {
    response.status(404).render(`errors/404`);
  }
});

articlesRouter.post(URL.ARTICLESURL.ADD, isAuthorAuth, upload.single(`upload`), csrfProtection, async (request, response) => {
  const {body, file} = request;
  const {user} = request.session;
  const articleData = {
    image: file ? file.filename : null,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: await collectCategories(body),
    createDate: body.date
  };

  try {
    await api.createArticle(articleData);
    response.redirect(URL.MY);
  } catch (errors) {
    const categories = await getAddArticleData();
    response.render(`articles/new-post`, {categories, errors: errors.response.data, article: articleData, csrfToken: request.csrfToken(), user});
  }
});

articlesRouter.post(URL.ARTICLESURL.EDIT, isAuthorAuth, upload.single(`upload`), csrfProtection, async (request, response) => {
  const {body, file} = request;
  const {user} = request.session;
  const {id} = request.params;
  if (file) {
    body.image = file.filename;
  }
  const articleData = {
    image: body.image ? body.image : null,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: await collectCategories(body),
    createDate: body.date
  };

  try {
    await api.editArticle(articleData, id);
    response.redirect(`${URL.ARTICLES}/${id}`);
  } catch (errors) {
    const {article, categories} = await getEditArticleData(id);
    articleData.categories = article.categories;
    response.render(`articles/edit-post`, {categories, errors: errors.response.data, article: articleData, id, csrfToken: request.csrfToken(), user});
  }
});

articlesRouter.post(URL.ARTICLESURL.COMMENTS, auth, csrfProtection, async (request, response) => {
  const {user} = request.session;
  const {id} = request.params;
  const {message} = request.body;
  try {
    await api.createComment(id, {userId: user.id, message});
    response.redirect(`${URL.ARTICLES}/${id}`);
  } catch (errors) {
    const article = await api.getArticle(request.params.id, true);
    response.render(`articles/post`, {article, errors: errors.response.data, id, user, csrfToken: request.csrfToken(), backHistory: request.session.path});
  }
});

articlesRouter.get(URL.ARTICLESURL.DELETE, isAuthorAuth, async (request, response) => {
  await api.deleteArticle(request.params.id);
  response.redirect(URL.MY);
});


articlesRouter.get(URL.ARTICLESURL.DELETE_COMMENTS, isAuthorAuth, async (request, response) => {
  await api.deleteComment(request.params.id, request.params.commentId);
  response.redirect(`${URL.MY}${URL.MYURLS.COMMENTS}`);
});

articlesRouter.use((req, res) => {
  res.status(404).render(`errors/404`);
});

module.exports = articlesRouter;
