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
  NOT_FOUND_COMMENT: `Comment not found`,
  BAD_REQUEST: `Invalid request params`,
  ARTICLE_CREATE: `Article created`,
  ARTICLE_EDIT: `Article edited`,
  ARTICLE_DELETE: `Article deleted`,
  COMMENT_ADD: `Comment added`,
  COMMENT_DELETE: `Comment deleted`,
  SERVER_ERROR: `Something went wrong`
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

const findComments = (articleId) => {
  const articleIndex = readingData.findIndex((elem) => articleId === elem.id);
  if (articleIndex === -1) {
    return {code: StatusCode.NOTFOUND, content: Messages.NOT_FOUND_ARTICLE};
  }
  return {code: StatusCode.OK, content: readingData[articleIndex].comments};
};

const addComment = (articleId, data) => {
  const articleIndex = readingData.findIndex((elem) => articleId === elem.id);
  if (articleIndex === -1) {
    return {code: StatusCode.NOTFOUND, message: Messages.NOT_FOUND_ARTICLE};
  }
  if (data.text) {
    readingData[articleIndex].comments.push({
      id: nanoid(6),
      text: data.text
    });
    return {code: StatusCode.OK, message: Messages.COMMENT_ADD};
  }
  return {code: StatusCode.BADREQUEST, message: Messages.BAD_REQUEST};
};

const deleteComment = (articleId, commentId) => {
  const articleIndex = readingData.findIndex((elem) => articleId === elem.id);
  if (articleIndex === -1) {
    return {code: StatusCode.NOTFOUND, message: Messages.NOT_FOUND_ARTICLE};
  }
  const commentIndex = readingData[articleIndex].comments.findIndex((elem) => commentId === elem.id);
  if (commentIndex === -1) {
    return {code: StatusCode.NOTFOUND, message: Messages.NOT_FOUND_COMMENT};
  }
  readingData[articleIndex].comments.splice(commentIndex, 1);
  return {code: StatusCode.OK, message: Messages.COMMENT_DELETE};
};

const searchArticle = (query) => {
  return readingData.filter((elem) => elem.title.indexOf(query) !== -1);
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

app.get(URL.API.COMMENTS, (request, response) => {
  const result = findComments(request.params.articleId);
  return response.status(result.code).send(result.content);
});

app.post(URL.API.COMMENTS, (request, response) => {
  const result = addComment(request.params.articleId, request.body);
  return response.status(result.code).send(result.message);
});

app.delete(URL.API.COMMENTID, (request, response) => {
  const result = deleteComment(request.params.articleId, request.params.commentId);
  return response.status(result.code).send(result.message);
});

app.get(URL.API.SEARCH, (request, response) => {
  const foundArticles = searchArticle(request.query.query);
  return foundArticles.length ? response.status(StatusCode.OK).send(foundArticles) :
    response.status(StatusCode.NOTFOUND).send(Messages.NOT_FOUND);
});

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
