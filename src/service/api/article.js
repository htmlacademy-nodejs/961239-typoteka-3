'use strict';

const {Router} = require(`express`);
const {URL, StatusCode, ServerMessages} = require(`./../constants`);
const articleValidator = require(`./../middlewares/article-validator`);
const commentValidator = require(`./../middlewares/comment-validator`);
const routeParamsValidator = require(`./../middlewares/route-params-validator`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(URL.API.ARTICLESROUTE, route);

  route.get(URL.API.BASEROUTE, async (request, response) => {
    const {offset, limit, comments} = request.query;
    let articles;
    if (limit || offset) {
      articles = await articleService.findPage({limit, offset});
    } else {
      articles = await articleService.findAll(comments);
    }
    if (!articles) {
      return response.status(StatusCode.NOTFOUND)
        .send(ServerMessages.NOT_FOUND);
    }
    return response.status(StatusCode.OK)
      .json(articles);
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
    return response.status(StatusCode.OK)
      .json(ServerMessages.ARTICLE_EDIT);
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

  route.delete(URL.API.COMMENTID, routeParamsValidator, async (request, response) => {
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
