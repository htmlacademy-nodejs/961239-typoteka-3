'use strict';

const {Router} = require(`express`);
const {URL, StatusCode, ServerMessages, TypeOfLimits} = require(`./../../constants`);
const articleValidator = require(`./../middlewares/article-validator`);
const commentValidator = require(`./../middlewares/comment-validator`);
const routeParamsValidator = require(`./../middlewares/route-params-validator`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(URL.API.ARTICLESROUTE, route);

  route.get(URL.API.BASEROUTE, async (request, response) => {
    const {offset, limit} = request.query;
    let {type} = request.query;
    let articles;
    if (Object.values(TypeOfLimits).every((a) => a !== type)) {
      if (limit || offset) {
        type = TypeOfLimits.API_PAGE;
      }
    }
    switch (type) {
      case TypeOfLimits.PAGE:
        articles = await articleService.findPage({limit, offset});
        break;
      case TypeOfLimits.HOTTEST:
        articles = await articleService.findHottest({limit, offset});
        break;
      case TypeOfLimits.COMMENTS:
        articles = await articleService.findAll(true);
        break;
      case TypeOfLimits.API_PAGE:
        articles = await articleService.findPage({limit, offset});
        break;
      default:
        articles = await articleService.findAll();
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
    return response.status(StatusCode.OK)
      .json(ServerMessages.COMMENT_DELETE);
  });
};
