'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {SCHEMA_NAME} = require(`./../constants`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  schema: SCHEMA_NAME,
  modelName: `Comment`,
  tableName: `comments`
});

module.exports = define;
