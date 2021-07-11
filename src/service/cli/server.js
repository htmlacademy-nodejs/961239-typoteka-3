'use strict';

const express = require(`express`);
const routes = require(`./../api`);
const {URL, Messages, StatusCode} = require(`./../constants`);
const {getLogger} = require(`./../lib/logger`);

const DEFAULT_PORT = 3000;

const logger = getLogger({name: `api`});

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(URL.API.PREFIX, routes);
app.use((request, response) => {
  response.status(StatusCode.NOTFOUND).send(Messages.NOT_FOUND);
  logger.error(`Route not found: ${request.url}`);
});

// next добавляем для того, чтобы не вызывать дефолтный обработчик 500й
// eslint-disable-next-line
app.use((error, request, response, next) => {
  console.error(error.stack);
  logger.error(`An error occured on processing request: ${error.message}`);
  return response.status(StatusCode.SERVERERROR).send(Messages.SERVER_ERROR);
});


module.exports = {
  name: `--server`,
  async run(portNumber) {
    const port = Number.parseInt(portNumber, 10) || DEFAULT_PORT;
    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      return process.exit(1);
    }
  }
};
