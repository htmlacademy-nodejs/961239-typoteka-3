'use strict';

const fs = require(`fs`).promises;
const {URL} = require(`./../constants`);
const express = require(`express`);
const path = require(`path`);

const DEFAULT_PORT = 3000;
const MOCK_DATA_PATH = path.resolve(__dirname, `./../../../mock.json`);

const NOT_FOUND_MESSAGE = `Not found`;
const NOT_FOUND_ARTICLE_MESSAGE = `Article not found`;

const StatusCode = {
  OK: `200`,
  CREATED: `201`,
  BAD_REQUEST: `400`,
  NOTFOUND: `404`,
  SERVERERROR: `500`
};

const app = express();
app.use(express.json());

const readingData = [];

const readData = async () => {
  const mockData = await fs.readFile(MOCK_DATA_PATH, `utf-8`);
  const mockDataArray = JSON.parse(mockData);
  Array.prototype.push.apply(readingData, mockDataArray);
};

readData();


const getArticle = (articleId) => readingData.find((elem) => articleId === elem.id);

app.get(URL.API.ARTICLES, (request, response) => response.json(readingData));

app.get(URL.API.ARTICLEID, (request, response) => {
  const article = getArticle(request.params.articleId);
  if (article) {
    return response.status(StatusCode.OK).send(article);
  }
  return response.status(StatusCode.NOTFOUND).send(NOT_FOUND_ARTICLE_MESSAGE);
});

app.use((request, response) => response
.status(StatusCode.NOTFOUND).send(NOT_FOUND_MESSAGE)
);


module.exports = {
  name: `--server`,
  run: (args) => parseInt(args, 10) ? app.listen(args) : app.listen(DEFAULT_PORT)
};
