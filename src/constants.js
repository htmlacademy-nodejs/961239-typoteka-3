'use strict';

const DEFAULT_COMMAND = `--version`;
const USER_ARVG_INDEX = 2;
const NOT_COMMAND_TEXT = `Команда не найдена. Приложение завершит свою работу`;
const EXIT_CODE = {
  SUCCESS: 0,
  ERROR: 1
};

const URL = {
  BASE: `/`,
  REGISTER: `/register`,
  LOGIN: `/login`,
  MY: `/my`,
  SEARCH: `/search`,
  CATEGORY: `/categories`,
  ARTICLES: `/articles`,
  ARTICLESURL: {
    CATEGORY: `/category/:id`,
    ID: `/:id`,
    ADD: `/add`,
    EDIT: `/:id/edit`,
    COMMENTS: `/:id/comments`
  },
  MYURLS: {
    COMMENTS: `/comments`
  },
  API: {
    PREFIX: `/api`,
    BASEROUTE: `/`,
    ARTICLESROUTE: `/articles`,
    ARTICLEID: `/:articleId`,
    CATEGORIESROUTE: `/categories`,
    COMMENTS: `/:articleId/comments`,
    COMMENTID: `/:articleId/comments/:commentId`,
    SEARCHROUTE: `/search`
  }
};

const ServerMessages = {
  NOT_FOUND: `Not found`,
  NOT_FOUND_ARTICLE: `Article not found`,
  NOT_FOUND_COMMENT: `Comment not found`,
  BAD_REQUEST: `Invalid request params`,
  ARTICLE_EDIT: `Article edited`,
  ARTICLE_DELETE: `Article deleted`,
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

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ValidationMessages = {
  COMMENT: {
    TEXT_MIN: `Комментарий должен содержать как минимум 20 символов`
  },
  ARTICLE: {
    CATEGORY_REQUIRED: `Необходимо выбрать как минимум одну категорию`,
    CATEGORY_INVALID: `ID категории должно быть числовым значением`,
    TITLE_MIN: `Заголовок должен содержать как минимум 30 символов`,
    TITLE_MAX: `Заголовок не может содержать более 250 символов`,
    ANNOUNCE_MIN: `Анонс должен содержать как минимум 30 символов`,
    ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
    FULLTEXT_MAX: `Текст публикации не может содержать более 1000 символов`
  }
};

const SCHEMA_NAME = `typoteka`;

const ANNOUNCE_SIZE = 250;
const FULLTEXT_SIZE = 1000;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARVG_INDEX,
  NOT_COMMAND_TEXT,
  EXIT_CODE,
  URL,
  ServerMessages,
  StatusCode,
  HttpMethod,
  ValidationMessages,
  SCHEMA_NAME,
  ANNOUNCE_SIZE,
  FULLTEXT_SIZE
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};
