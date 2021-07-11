'use strict';

const {nanoid} = require(`nanoid`);
const {Messages, StatusCode} = require(`./../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  getAll() {
    return {status: StatusCode.OK, content: this._articles};
  }

  getOne(id) {
    const article = this._articles.find((elem) => id === elem.id);
    if (article) {
      return {status: StatusCode.OK, content: article};
    }
    return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
  }

  add(articleData) {
    if (this._checkArticle(articleData)) {
      this._articles.push({
        id: nanoid(6),
        title: articleData.title,
        announce: articleData.announce,
        fullText: articleData.fullText,
        createDate: articleData.createDate,
        categories: articleData.categories,
        image: articleData.image || null,
        comments: []
      });
      return {status: StatusCode.CREATED, content: Messages.ARTICLE_CREATE};
    }
    return {status: StatusCode.BADREQUEST, content: Messages.BAD_REQUEST};
  }

  edit(articleData) {
    const {data, articleId} = articleData;
    const articleIndex = this._articles.findIndex((elem) => articleId === elem.id);
    if (articleIndex === -1) {
      return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
    }
    if (this._checkArticle(data)) {
      this._articles[articleIndex] = {...this._articles[articleIndex],
        title: data.title,
        announce: data.announce,
        fullText: data.fullText,
        categories: data.categories,
        image: data.image || null
      };
      return {status: StatusCode.OK, content: Messages.ARTICLE_EDIT};
    }
    return {status: StatusCode.BADREQUEST, content: Messages.BAD_REQUEST};
  }

  delete(articleId) {
    const articleIndex = this._articles.findIndex((elem) => articleId === elem.id);
    if (articleIndex === -1) {
      return {status: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
    }
    this._articles.splice(articleIndex, 1);
    return {status: StatusCode.OK, content: Messages.ARTICLE_DELETE};
  }

  _checkArticle(articleData) {
    return articleData.title && articleData.fullText && articleData.createDate && articleData.categories;
  }
}

module.exports = ArticleService;
