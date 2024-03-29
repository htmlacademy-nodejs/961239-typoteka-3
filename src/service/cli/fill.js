'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);
const {EXIT_CODE} = require(`./../../constants`);
const {getRandomInt, shuffle} = require(`./../../utils/dev-utils`);

const FILENAME = path.resolve(__dirname, `./../../../fill-db.sql`);
const DEFAULT_MOCK_COUNT = 1;
const MAX_MOCK_COUNT = 1000;

const NOT_WORKING_TEXT = `Не удалось сгенерировать данные, приложение завершит свою работу.`;
const MANY_PUBL_TEXT = `Не больше 1000 публикаций`;
const SUCCESS_TEXT = `Данные сгенерированны. Новый файл создан.`;

const ANNOUNCE_MAX_COUNT = 5;

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const USERS = [
  {
    email: `test_andrew@mail.com`,
    firstname: `Andrew`,
    lastname: `Testov`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `example05.jpg`,
    isAuthor: true
  },
  {
    email: `test_ann@mail.com`,
    firstname: `Ann`,
    lastname: `Narrow`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `example06.jpg`,
    isAuthor: false
  },
  {
    email: `test_josh@mail.com`,
    firstname: `Joshua`,
    lastname: `Shepard`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `example07.jpg`,
    isAuthor: false
  },
  {
    email: `test_testov@mail.com`,
    firstname: `Test`,
    lastname: `Testov`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `example08.jpg`,
    isAuthor: false
  }];

const titlesDataPath = path.resolve(__dirname, `./../../data/titles.txt`);
const sentencesDataPath = path.resolve(__dirname, `./../../data/sentences.txt`);
const commentsDataPath = path.resolve(__dirname, `./../../data/comments.txt`);

const nowDate = new Date(Date.now());
const lowDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDay());

const readMockData = async (dataPath) => {
  const mockData = await fs.readFile(dataPath, `utf-8`);
  return mockData.split(`\n`);
};

const generateMockComments = (commentsList, count) => {
  const comments = new Array(count).fill(` `).map(() =>({
    message: commentsList[getRandomInt(1, commentsList.length - 1)],
    userid: getRandomInt(1, USERS.length),
    createDate: new Date(getRandomInt(lowDate.getTime(), nowDate.getTime())),
  }));
  return comments;
};

const generateArticle = (TITLE_PUBL, ANNOUNCE_PUBL, COMMENTS_PUBL) => ({
  title: TITLE_PUBL[getRandomInt(0, TITLE_PUBL.length - 1)],
  announce: shuffle(ANNOUNCE_PUBL).slice(0, getRandomInt(1, ANNOUNCE_MAX_COUNT)).join(` `),
  fullText: shuffle(ANNOUNCE_PUBL).slice(0, getRandomInt(1, ANNOUNCE_PUBL.length)).join(` `),
  createDate: new Date(getRandomInt(lowDate.getTime(), nowDate.getTime())),
  image: `example0${getRandomInt(1, 4)}.jpg`,
  categories: getRandomInt(1, CATEGORIES.length),
  comments: generateMockComments(COMMENTS_PUBL, getRandomInt(0, COMMENTS_PUBL.length))
});

const generateData = async (count) => {
  const TITLE_PUBL = await readMockData(titlesDataPath);
  const ANNOUNCE_PUBL = await readMockData(sentencesDataPath);
  const COMMENTS_PUBL = await readMockData(commentsDataPath);
  return new Array(count).fill({}).map(() => generateArticle(TITLE_PUBL, ANNOUNCE_PUBL, COMMENTS_PUBL));
};

const convertToSQL = (articles) => {
  const usersValues = USERS.map(
      ({email, firstname, lastname, password, avatar, isAuthor}) =>
        `('${email}', '${firstname}', '${lastname}', '${password}', '${avatar}', ${isAuthor})`)
        .join(`,\n`);
  const categoriesValues = CATEGORIES.map((category) => `('${category}')`).join(`,\n`);
  const articlesValues = articles.map(({title, announce, fullText, createDate, image}) =>
    `('${title}', '${createDate}', '${announce}', '${fullText}', '${image}')`).join(`,\n`);
  const articlesCategoriesValues = articles.map(({categories}, index) => `(${categories + 1}, ${index + 1})`).join(`,\n`);
  const commentsValues = articles.map(({comments}, index) =>
    comments.map(({userid, message, createDate}) => `(${userid}, ${index + 1}, '${createDate}', '${message}')`).join(`,\n`)).join(`,\n`);

  const query = `
INSERT INTO articles (title, created_date, announce, full_text, image)
VALUES ${articlesValues};

INSERT INTO categories (name)
VALUES ${categoriesValues};

ALTER TABLE users DISABLE TRIGGER ALL;
INSERT INTO users (email, firstname, lastname, password, avatar, isAuthor)
VALUES ${usersValues}
ALTER TABLE users ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments (user_id, article_id, date, message)
VALUES ${commentsValues};
ALTER TABLE comments ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories (category_id, article_id)
VALUES ${articlesCategoriesValues}
ALTER TABLE articles_categories ENABLE TRIGGER ALL;`;
  return query;
};

const writeMockQuery = async (data) => {
  try {
    await fs.writeFile(FILENAME, data);
    console.info(chalk.green(SUCCESS_TEXT));
    process.exit(EXIT_CODE.SUCCESS);
  } catch (err) {
    console.error(chalk.red(NOT_WORKING_TEXT));
    process.exit(EXIT_CODE.ERROR);
  }
};

const createMockData = async (param) => {
  const count = Number.parseInt(param, 10);
  if (Number.isNaN(count)) {
    const mock = await generateData(DEFAULT_MOCK_COUNT);
    writeMockQuery(convertToSQL(mock));
    return;
  }

  if (count > MAX_MOCK_COUNT) {
    console.error(chalk.red(MANY_PUBL_TEXT));
    process.exit(EXIT_CODE.ERROR);
  }
  const mock = await generateData(count);
  writeMockQuery(convertToSQL(mock));
};

module.exports = {
  name: `--fill`,
  run: createMockData
};
