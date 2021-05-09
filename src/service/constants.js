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
    ARTICLES: `/api/articles`,
    ARTICLEID: `api/articles/:articleId`,
    CATEGORIES: `/api/categories`,
    COMMENTS: `/api/articles/:articleId/comments`,
    COMMENTID: `/api/articles/:articleId/comments/:commentId`,
    SEARCH: `/api/search?query=`
  }
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARVG_INDEX,
  NOT_COMMAND_TEXT,
  EXIT_CODE,
  URL
};
