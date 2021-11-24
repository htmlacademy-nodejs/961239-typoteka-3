'use strict';
const Aliase = require(`./../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      include: [{
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`, `isAuthor`]
        }
      }],
      order: [[`createdAt`, `DESC`]],
      raw: true
    });
  }

  async findLatest(limit) {
    const {rows} = await this._Comment.findAndCountAll({
      limit,
      include: [{
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`, `isAuthor`]
        }
      }],
      order: [[`createdAt`, `DESC`]]
    });
    return {comments: rows};
  }
  async create(articleId, commentData) {
    const article = await this._Article.findByPk(articleId);
    return article.createComment(commentData);
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
