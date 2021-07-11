'use strict';

const {StatusCode} = require(`../constants`);

class CategoryService {
  constructor(articles) {
    this._articles = articles;
    this.findAll = this.findAll.bind(this);
  }

  findAll() {
    const foundCategories = [];
    this._articles.forEach(({categories}) => {
      categories.forEach((elemCategory) => {
        if (!foundCategories.includes(elemCategory)) {
          foundCategories.push(elemCategory);
        }
      });
    });
    return {status: StatusCode.OK, content: foundCategories};
  }
}

module.exports = CategoryService;

