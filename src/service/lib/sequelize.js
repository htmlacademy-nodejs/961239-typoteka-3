'use strict';

const Sequelize = require(`sequelize`);
const {DB_HOST, DB_PORT, DB_DIALECT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

const checkVariables = [DB_HOST, DB_PORT, DB_DIALECT, DB_NAME, DB_USER, DB_PASSWORD].some((variable, index) => {
  if (variable === undefined) {
    console.log(index);
    return true;
  }
  return false;
});

if (checkVariables) {
  throw new Error(`One or more environmental variables are not defined`);
}

module.exports = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  }
});

