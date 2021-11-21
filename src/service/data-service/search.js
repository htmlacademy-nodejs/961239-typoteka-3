'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`./../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll(searchText) {

    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.iLike]: `%${searchText}%`
        }
      },
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return articles.map((article) => article.get());
  }

}

module.exports = SearchService;
