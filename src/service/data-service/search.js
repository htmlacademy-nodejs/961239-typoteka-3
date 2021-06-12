'use strict';

const {Messages, StatusCode} = require(`./../constants`);

class SearchService {
  constructor(articles) {
    this._articles = articles;
    this.findArticles = this.findArticles.bind(this);
  }

  findArticles(query) {
    const foundarticles = this._articles.filter((elem) => elem.title.indexOf(query) !== -1);
    return foundarticles.length ? {status: StatusCode.OK, content: foundarticles} :
      {status: StatusCode.NOTFOUND, content: Messages.NO_RESULT};
  }
}

module.exports = SearchService;
