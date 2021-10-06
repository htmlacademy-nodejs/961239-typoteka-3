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
    CATEGORY: `/category`,
    ID: `/:id`,
    ADD: `/add`,
    EDIT: `/edit`
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

const SCHEMA_NAME = `typoteka`;

const ANNOUNCE_SIZE = 250;
const FULLTEXT_SIZE = 1000;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARVG_INDEX,
  NOT_COMMAND_TEXT,
  EXIT_CODE,
  URL,
  Messages,
  StatusCode,
  SCHEMA_NAME,
  ANNOUNCE_SIZE,
  FULLTEXT_SIZE
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};
