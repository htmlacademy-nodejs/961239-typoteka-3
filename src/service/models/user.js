'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {SCHEMA_NAME} = require(`../../constants`);

class User extends Model {}
const define = (sequelize) => User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  schema: SCHEMA_NAME,
  modelName: `User`,
  tableName: `users`
});

module.exports = define;
