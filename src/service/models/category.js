'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {SCHEMA_NAME} = require(`./../constants`);

class Category extends Model {}

const define = (sequelize) => Category.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  schema: SCHEMA_NAME,
  modelName: `Category`,
  tableName: `categories`
});

module.exports = define;
