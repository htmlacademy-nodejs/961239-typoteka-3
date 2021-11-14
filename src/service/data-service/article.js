'use strict';
const Aliase = require(`./../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._sequelize = sequelize;
  }

  async findAll(NeedComments) {
    const include = [Aliase.CATEGORIES];

    if (NeedComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`, `isAuthor`]
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
      as: Aliase.COMMENTS,
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`, `email`, `isAuthor`]
          }
        }
      ]
    }]});
  }

  async findPage({limit, offset}) {
    const include = [Aliase.CATEGORIES, Aliase.COMMENTS];


    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      distinct: true,
      order: [[`createdAt`, `DESC`]]
    });
    return {count, articles: rows};
  }

  async findHottest({limit}) {
    const {rows} = await this._Article.findAndCountAll({
      subQuery: false,
      limit,
      offset: 0,
      attributes: {include: [[this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]]},
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        required: true,
        attributes: []
      }],
      group: [`Article.id`],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ],
      distinct: true
    });

    return {articles: rows};
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

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: {id}
    });
    const updatedArticle = await this._Article.findByPk(id);
    await updatedArticle.setCategories(articleData.categories);
    return !!affectedRows;

  }
}

module.exports = ArticleService;
