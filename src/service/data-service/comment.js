'use strict';

const {nanoid} = require(`nanoid`);
const {Messages, StatusCode} = require(`./../constants`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
    this.getAll = this.getAll.bind(this);
    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
  }

  getAll(articleId) {
    const articleIndex = this._articles.findIndex((elem) => articleId === elem.id);
    if (articleIndex === -1) {
      return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
    }
    return {status: StatusCode.OK, content: this._articles[articleIndex].comments};
  }

  add(commentData) {
    const {articleId, message} = commentData;
    const articleIndex = this._articles.findIndex((elem) => articleId === elem.id);
    if (articleIndex === -1) {
      return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
    }
    if (message.text) {
      this._articles[articleIndex].comments.push({
        text: message.text,
        id: nanoid(6)
      });
      return {status: StatusCode.CREATED, content: Messages.COMMENT_ADD};
    }
    return {status: StatusCode.BADREQUEST, content: Messages.BAD_REQUEST};
  }

  delete(requestData) {
    const {articleId, commentId} = requestData;
    const articleIndex = this._articles.findIndex((elem) => articleId === elem.id);
    if (articleIndex === -1) {
      return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
    }
    const commentIndex = this._articles[articleIndex].comments.findIndex((elem) => commentId === elem.id);
    if (commentIndex === -1) {
      return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_COMMENT};
    }
    this._articles[articleIndex].comments.splice(commentIndex, 1);
    return {status: StatusCode.OK, content: Messages.COMMENT_DELETE};
  }
}

module.exports = CommentService;
