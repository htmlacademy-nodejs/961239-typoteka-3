'use strict';

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
        attributes: {
          exclude: [`passwordHash`]
        }
      }],
      raw: true,
    });
  }

  async create(articleId, commentData) {
    const article = await this._Article.findByPk(articleId);
    return article.createComment(commentData);
  }

  async delete(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
