'use strict';

const fs = require(`fs`).promises;
const {URL} = require(`./../constants`);
const express = require(`express`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const DEFAULT_PORT = 3000;
const MOCK_DATA_PATH = path.resolve(__dirname, `./../../../mock.json`);

const Messages = {
  NOT_FOUND: `Not found`,
  NOT_FOUND_ARTICLE: `Article not found`,
  BAD_REQUEST: `Invalid request params`,
  ARTICLE_CREATE: `Article created`,
  ARTICLE_EDIT: `Article edited`,
  ARTICLE_DELETE: `Article deleted`
};

const StatusCode = {
  OK: `200`,
  CREATED: `201`,
  BADREQUEST: `400`,
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

const findAllCategories = () => {
  const categories = [];
  readingData.forEach((elem) => {
    elem.category.forEach((elemCategory) => {
      if (!categories.includes(elemCategory)) {
        categories.push(elemCategory);
      }
    });
  });
  return categories;
};

const addArticle = (articleData) => {
  if (checkArticle(articleData)) {
    readingData.push({
      id: nanoid(6),
      title: articleData.title,
      announce: articleData.announce,
      fullText: articleData.fullText,
      createDate: articleData.createDate,
      category: articleData.category,
      comments: []
    });
    return {code: StatusCode.CREATED, message: Messages.ARTICLE_CREATE};
  }
  return {code: StatusCode.BADREQUEST, message: Messages.BAD_REQUEST};
};

const editArticle = (articleId, articleData) => {
  const articleIndex = readingData.findIndex((elem) => articleId === elem.id);
  if (articleIndex === -1) {
    return {code: StatusCode.NOTFOUND, message: Messages.NOT_FOUND_ARTICLE};
  }
  if (checkArticle(articleData)) {
    readingData[articleIndex] = {...readingData[articleIndex],
      title: articleData.title,
      announce: articleData.announce,
      fullText: articleData.fullText,
      category: articleData.category
    };
    return {code: StatusCode.OK, message: Messages.ARTICLE_EDIT};
  }
  return {code: StatusCode.BADREQUEST, message: Messages.BAD_REQUEST};
};

const deleteArticle = (articleId) => {
  const articleIndex = readingData.findIndex((elem) => articleId === elem.id);
  if (articleIndex === -1) {
    return {code: StatusCode.NOTFOUND, message: Messages.NOT_FOUND_ARTICLE};
  }
  readingData.splice(articleIndex, 1);
  return {code: StatusCode.OK, message: Messages.ARTICLE_DELETE};
};

const checkArticle = (articleData) =>
  articleData.title && articleData.fullText && articleData.createDate && articleData.category;

app.get(URL.API.ARTICLES, (request, response) => response.json(readingData));

app.get(URL.API.ARTICLEID, (request, response) => {
  const article = getArticle(request.params.articleId);
  if (article) {
    return response.status(StatusCode.OK).send(article);
  }
  return response.status(StatusCode.NOTFOUND).send(Messages.NOT_FOUND_ARTICLE);
});

app.get(URL.API.CATEGORIES, (request, response) => response.status(StatusCode.OK).send(findAllCategories()));

app.post(URL.API.ARTICLES, (request, response) => {
  const result = addArticle(request.body);
  return response.status(result.code).send(result.message);
});

app.put(URL.API.ARTICLEID, (request, response) => {
  const result = editArticle(request.params.articleId, request.body);
  return response.status(result.code).send(result.message);
});

app.delete(URL.API.ARTICLEID, (request, response) => {
  const result = deleteArticle(request.params.articleId);
  return response.status(result.code).send(result.message);
});

app.use((request, response) => response
.status(StatusCode.NOTFOUND).send(Messages.NOT_FOUND)
);


module.exports = {
  name: `--server`,
  run: (port) => parseInt(port, 10) ? app.listen(port) : app.listen(DEFAULT_PORT)
};
