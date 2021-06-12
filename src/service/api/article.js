'use strict';

const {Router} = require(`express`);
const {URL} = require(`./../constants`);
const {requestHandler} = require(`./../utils/utils`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(URL.API.ARTICLESROUTE, route);

  route.get(URL.API.BASEROUTE, (request, response) => requestHandler(response, articleService.getAll));

  route.get(URL.API.ARTICLEID, (request, response) => requestHandler(response, articleService.getOne, request.params.articleId));

  route.post(URL.API.BASEROUTE, (request, response) => requestHandler(response, articleService.add, request.body));

  route.put(URL.API.ARTICLEID, (request, response) =>
    requestHandler(response, articleService.edit, {data: request.body, articleId: request.params.articleId}));

  route.delete(URL.API.ARTICLEID, (request, response) => requestHandler(response, articleService.delete, request.params.articleId));

  route.get(URL.API.COMMENTS, (request, response) => requestHandler(response, commentService.getAll, request.params.articleId));

  route.post(URL.API.COMMENTS, (request, response) =>
    requestHandler(response, commentService.add, {articleId: request.params.articleId, message: request.body}));

  route.delete(URL.API.COMMENTID, (request, response) =>
    requestHandler(response, commentService.delete, {articleId: request.params.articleId, commentId: request.params.commentId}));
};
