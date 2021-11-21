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
  LOGOUT: `/logout`,
  MY: `/my`,
  SEARCH: `/search`,
  CATEGORY: `/categories`,
  EDIT_CATEGORY: `/categories/:id`,
  DELETE_CATEGORY: `/categories/:id/delete`,
  ARTICLES: `/articles`,
  ARTICLESURL: {
    CATEGORY: `/category/:id`,
    ID: `/:id`,
    ADD: `/add`,
    EDIT: `/edit/:id`,
    COMMENTS: `/:id/comments`,
    DELETE: `/:id/delete`,
    DELETE_COMMENTS: `/:id/comments/:commentId/delete`
  },
  MYURLS: {
    COMMENTS: `/comments`
  },
  API: {
    PREFIX: `/api`,
    BASEROUTE: `/`,
    ARTICLESROUTE: `/articles`,
    ARTICLEID: `/:articleId`,
    LATESTCOMMENTS: `/comments/last`,
    CATEGORIESROUTE: `/categories`,
    CATEGORIESID: `/:categoryId`,
    COMMENTS: `/:articleId/comments`,
    COMMENTID: `/:articleId/comments/:commentId`,
    SEARCHROUTE: `/search`,
    USERROUTE: `/user`,
    AUTHROUTE: `/auth`
  }
};

const ServerMessages = {
  NOT_FOUND: `Not found`,
  NOT_FOUND_ARTICLE: `Article not found`,
  NOT_FOUND_CATEGORY: `Category not found`,
  NOT_FOUND_COMMENT: `Comment not found`,
  BAD_REQUEST: `Invalid request params`,
  ARTICLE_EDIT: `Article edited`,
  ARTICLE_DELETE: `Article deleted`,
  CATEGORY_DELETE: `Category deleted`,
  COMMENT_DELETE: `Comment deleted`,
  SERVER_ERROR: `Something went wrong`
};

const StatusCode = {
  OK: `200`,
  CREATED: `201`,
  BADREQUEST: `400`,
  UNAUTHORIZED: `401`,
  NOTFOUND: `404`,
  CONFLICT: `409`,
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
    TEXT_MIN: `Комментарий должен содержать как минимум 20 символов`,
    USER_ID: `Некорректный идентификатор пользователя`
  },
  ARTICLE: {
    CATEGORY_REQUIRED: `Необходимо выбрать как минимум одну категорию`,
    CATEGORY_INVALID: `ID категории должно быть числовым значением`,
    TITLE_MIN: `Заголовок должен содержать как минимум 30 символов`,
    TITLE_MAX: `Заголовок не может содержать более 250 символов`,
    ANNOUNCE_MIN: `Анонс должен содержать как минимум 30 символов`,
    ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
    FULLTEXT_MAX: `Текст публикации не может содержать более 1000 символов`,
    IMAGE: `Изображение может быть только в формате .png или .jpg`,
    DATE_EMPTY: `Поле Дата публикации не может быть пустым`
  },
  CATEGORY: {
    NAME_MIN: `Имя категории должно содержать минимум 5 символов`,
    NAME_MAX: `Имя категории должно содержать не более 30 символов`,
    CATEGORY_EXIST: `Категория с такими именем уже существует`
  },
  USER: {
    NAME: `Имя содержит некорректные символы`,
    NAME_REQUIRED: `Поле Имя обязательно для заполнения`,
    EMAIL: `Некорректный электронный адрес`,
    EMAIL_REQUIRED: `Поле Email обязательно для заполнения`,
    EMAIL_EXIST: `Электронный адрес уже используется`,
    PASSWORD: `Пароль содержит меньше 6-ти символов`,
    PASSWORD_REQUIRED: `Поле Пароль обязательно для заполнения`,
    PASSWORD_REPEATED: `Пароли не совпадают`,
    AVATAR: `Тип изображения не поддерживается`
  },
  LOGIN: {
    EMAIL_NOT_EXIST: `Электронный адрес не существует`,
    PASSWORD_NOT_MATCH: `Неверный пароль`
  }
};

const TypeOfLimits = {
  HOTTEST: `hot`,
  PAGE: `page`,
  API_PAGE: `api-page`,
  COMMENTS: `comments`,
  CATEGORIES: `categories`
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
  TypeOfLimits,
  SCHEMA_NAME,
  ANNOUNCE_SIZE,
  FULLTEXT_SIZE
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};
