'use strict';

const Aliase = require(`./../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._sequelize = sequelize;
  }

  async findAll(withArticles) {
    const result = await this._Category.findAll({
      attributes: {
        include: [[this._sequelize.fn(`COUNT`, this._sequelize.col(`articleCategories.CategoryId`)), `count`]]
      },
      include: [{
        model: this._ArticleCategory,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: [],
        required: withArticles ? true : false
      }],
      group: [`Category.id`],
      order: withArticles ? [[this._sequelize.fn(`COUNT`, this._sequelize.col(`articleCategories.CategoryId`)), `DESC`]] : [[`id`, `ASC`]]
    });
    return result.map((it) => it.get());
  }

  async findByName(name) {
    const category = await this._Category.findOne({
      where: {name}
    });
    return category && category.get();
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);
    return category;
  }

  async update(id, categoryData) {
    const [affectedRows] = await this._Category.update(categoryData, {
      where: {id}
    });
    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;
