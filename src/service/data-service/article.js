'use strict';
const Aliase = require(`./../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async findAll(NeedComments) {
    const include = [Aliase.CATEGORIES,
      {
        model: this._User,
        attributes: {
          exclude: [`passwordHash`]
        }
      }];

    if (NeedComments) {
      include.push({
        model: this._Comment,
        include: [
          {
            model: this._User,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const articles = await this._Article.findAll({
      include,
      subQuery: false,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  findOne(id) {
    return this._Article.findByPk(id, {include: [Aliase.CATEGORIES, {
      model: this._Comment,
      include: [
        {
          model: this._User,
          attributes: {
            exclude: [`passwordHash`, `email`]
          }
        }
      ]
    }, {
      model: this._User,
      attributes: {
        exclude: [`passwordHash`]
      }
    }]});
  }

  async findPage({limit, offset, needComments}) {
    const include = [Aliase.CATEGORIES, {
      model: this._User,
      attributes: {
        exclude: [`passwordHash`]
      }
    }];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      distinct: true
    });
    return {count, articles: rows};
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    const newArticle = await this._Article.findByPk(article.get().id, {include: Aliase.CATEGORIES});
    return newArticle;
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;

  }
}

module.exports = ArticleService;
