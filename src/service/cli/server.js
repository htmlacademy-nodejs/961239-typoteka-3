'use strict';

const express = require(`express`);
const routes = require(`./../api`);
const {URL, Messages, StatusCode} = require(`./../constants`);

const DEFAULT_PORT = 3000;

const app = express();
app.use(express.json());

app.use(URL.API.PREFIX, routes);
app.use((request, response) => response
.status(StatusCode.NOTFOUND).send(Messages.NOT_FOUND)
);

// next добавляем для того, чтобы не вызывать дефолтный обработчик 500й
// eslint-disable-next-line
app.use((error, request, response, next) => {
  console.error(error.stack);
  return response.status(StatusCode.SERVERERROR).send(Messages.SERVER_ERROR);
});


module.exports = {
  name: `--server`,
  run: (port) => parseInt(port, 10) ? app.listen(port) : app.listen(DEFAULT_PORT)
};
