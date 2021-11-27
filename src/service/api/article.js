'use strict';

const {Router} = require(`express`);
const {URL, StatusCode, ServerMessages, Source} = require(`./../../constants`);
const articleValidator = require(`./../middlewares/article-validator`);
const commentValidator = require(`./../middlewares/comment-validator`);
const routeParamsValidator = require(`./../middlewares/route-params-validator`);

const HOTTEST_ARTICLES_COUNT = 4;
const LATEST_COMMENTS_COUNT = 4;

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(URL.API.ARTICLESROUTE, route);

  route.get(URL.API.BASEROUTE, async (request, response) => {
    const {offset, limit, id} = request.query;
    let {source} = request.query;
    let articles;
    if (Object.values(Source).every((a) => a !== source)) {
      if (limit || offset) {
        source = Source.API_PAGE;
      }
    }
    switch (source) {
      case Source.PAGE: {
        articles = await articleService.findPage({limit, offset});
        break;
      }
      case Source.HOTTEST: {
        articles = await articleService.findHottest({limit, offset});
        break;
      }
      case Source.COMMENTS: {
        articles = await articleService.findAll(true);
        break;
      }
      case Source.API_PAGE: {
        articles = await articleService.findPage({limit, offset});
        break;
      }
      case Source.CATEGORIES: {
        articles = await articleService.findByCategory({limit, id});
        break;
      }
      default: {
        articles = await articleService.findAll();
      }
    }
    return response.status(StatusCode.OK)
      .json(articles);
  });

  route.get(URL.API.LATESTCOMMENTS, async (request, response) => {
    const {limit} = request.query;
    const comments = await commentService.findLatest(limit);
    return response.status(StatusCode.OK)
      .json(comments);
  });

  route.get(URL.API.ARTICLEID, routeParamsValidator, async (request, response) => {
    const {articleId} = request.params;
    const article = await articleService.findOne(articleId);
    if (!article) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND_ARTICLE);
    }
    return response.status(StatusCode.OK)
      .json(article);
  });

  route.post(URL.API.BASEROUTE, articleValidator, async (request, response) => {
    const newArticle = await articleService.create(request.body);
    return response.status(StatusCode.CREATED)
      .json(newArticle);
  });

  route.put(URL.API.ARTICLEID, [articleValidator, routeParamsValidator], async (request, response) => {
    const {articleId} = request.params;
    const updatedArticle = await articleService.update(articleId, request.body);
    if (!updatedArticle) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND_ARTICLE);
    }
    const updatedArticleData = await articleService.findOne(articleId);
    return response.status(StatusCode.OK)
      .json(updatedArticleData);
  });

  route.delete(URL.API.ARTICLEID, routeParamsValidator, async (request, response) => {
    const {articleId} = request.params;
    const deletedArticle = await articleService.delete(articleId);
    if (!deletedArticle) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND_ARTICLE);
    }
    const hotArticles = await articleService.findHottest({HOTTEST_ARTICLES_COUNT});
    const latestComments = await commentService.findLatest(LATEST_COMMENTS_COUNT);
    const io = request.app.locals.socketio;
    io.emit(`article::delete`, {hotArticles: hotArticles.articles, latestComments: latestComments.comments});
    return response.status(StatusCode.OK)
      .json(ServerMessages.ARTICLE_DELETE);
  });

  route.get(URL.API.COMMENTS, routeParamsValidator, async (request, response) => {
    const {articleId} = request.params;
    const comments = await commentService.findAll(articleId);
    return response.status(StatusCode.OK)
      .json(comments);
  });

  route.post(URL.API.COMMENTS, [routeParamsValidator, commentValidator], async (request, response) => {
    const {articleId} = request.params;
    const newComment = await commentService.create(articleId, request.body);
    const hotArticles = await articleService.findHottest({HOTTEST_ARTICLES_COUNT});
    const latestComments = await commentService.findLatest(LATEST_COMMENTS_COUNT);
    const io = request.app.locals.socketio;
    io.emit(`comment::create`, {hotArticles: hotArticles.articles, latestComments: latestComments.comments});

    return response.status(StatusCode.CREATED)
      .json(newComment);
  });

  route.delete(URL.API.COMMENTID, async (request, response) => {
    const {commentId} = request.params;
    const deletedComment = await commentService.delete(commentId);
    if (!deletedComment) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND_COMMENT);
    }
    const latestComments = await commentService.findLatest(LATEST_COMMENTS_COUNT);
    const hotArticles = await articleService.findHottest({HOTTEST_ARTICLES_COUNT});
    const io = request.app.locals.socketio;
    io.emit(`comment::delete`, {hotArticles: hotArticles.articles, latestComments: latestComments.comments});
    return response.status(StatusCode.OK)
      .json(ServerMessages.COMMENT_DELETE);
  });
};
