'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {EXIT_CODE} = require(`./../constants`);
const {getRandomInt, shuffle} = require(`./../utils/utils`);

const TITLES_PATH = `./../data/titles.txt`;
const CATEGORIES_PATH = `./../data/categories.txt`;
const SENTENCES_PATH = `./../data/sentences.txt`;
const COMMENTS_PATH = `./../data/comments.txt`;

const FILENAME = `./../../mock.json`;
const DEFAULT_MOCK_COUNT = 1;
const MAX_MOCK_COUNT = 1000;

const NOT_WORKING_TEXT = `Не удалось сгенерировать данные, приложение завершит свою работу.`;
const MANY_PUBL_TEXT = `Не больше 1000 публикаций`;
const SUCCESS_TEXT = `Данные сгенерированны. Новый файл создан.`;

const ANNOUNCE_MAX_COUNT = 5;
const NOW_DATE = new Date(Date.now());
const LOW_DATE = new Date(NOW_DATE.getFullYear(), NOW_DATE.getMonth() - 3, NOW_DATE.getDay());

const readMockData = async (path) => {
  const mockData = await fs.readFile(path, `utf-8`);
  return mockData.split(`\n`);
};

const generateMockComments = (commentsList, count) => {
  const comments = new Array(count).fill(` `).map(() =>({
    id: nanoid(6),
    text: commentsList[getRandomInt(0, commentsList.length - 1)]
  }));
  return comments;
};

const generatePublication = (TITLE_PUBL, ANNOUNCE_PUBL, CATEGORY_PUBL, COMMENTS_PUBL) => ({
  id: nanoid(6),
  title: TITLE_PUBL[getRandomInt(0, TITLE_PUBL.length - 1)],
  announce: shuffle(ANNOUNCE_PUBL).slice(0, getRandomInt(1, ANNOUNCE_MAX_COUNT)).join(` `),
  fullText: shuffle(ANNOUNCE_PUBL).slice(0, getRandomInt(1, ANNOUNCE_PUBL.length)).join(` `),
  createDate: new Date(getRandomInt(LOW_DATE, NOW_DATE)),
  category: shuffle(CATEGORY_PUBL).slice(getRandomInt(0, CATEGORY_PUBL.length - 1)),
  comments: generateMockComments(COMMENTS_PUBL, getRandomInt(0, COMMENTS_PUBL.length))
});

const generatePublications = async (count) => {
  const TITLE_PUBL = await readMockData(TITLES_PATH);
  const ANNOUNCE_PUBL = await readMockData(SENTENCES_PATH);
  const CATEGORY_PUBL = await readMockData(CATEGORIES_PATH);
  const COMMENTS_PUBL = await readMockData(COMMENTS_PATH);
  return JSON.stringify(new Array(count).fill({}).map(() => generatePublication(TITLE_PUBL, ANNOUNCE_PUBL, CATEGORY_PUBL, COMMENTS_PUBL)));
};

const writeMock = async (data) => {
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
    const mock = await generatePublications(DEFAULT_MOCK_COUNT);
    writeMock(mock);
    return;
  }

  if (count > MAX_MOCK_COUNT) {
    console.error(chalk.red(MANY_PUBL_TEXT));
    process.exit(EXIT_CODE.ERROR);
  }
  const mock = await generatePublications(count);
  writeMock(mock);
};

module.exports = {
  name: `--generate`,
  run: createMockData
};
