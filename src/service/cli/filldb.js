'use strict';

const fs = require(`fs`).promises;
const moment = require(`moment`);
const path = require(`path`);
const {EXIT_CODE, ANNOUNCE_SIZE, FULLTEXT_SIZE} = require(`./../../constants`);
const {getRandomInt, shuffle, getRandomDate} = require(`./../../utils/dev-utils`);
const {getLogger} = require(`./../lib/logger`);
const sequelize = require(`./../lib/sequelize`);
const initDB = require(`./../lib/init-db`);
const passwordUtils = require(`./../lib/password`);

const THREE_DOTS_COUNT = 3;
const SENTENCES_MAX_COUNT = 5;
const DEFAULT_MOCK_COUNT = 1;

const logger = getLogger({name: `api`});

const readMockData = async (dataPath) => {
  const mockData = await fs.readFile(dataPath, `utf-8`);
  return mockData.split(`\n`);
};

const generateMockComments = (count, comments, user) => {
  const commentsList = new Array(count).fill(` `).map(() =>({
    message: comments[getRandomInt(0, comments.length - 1)],
    user
  }));
  return commentsList;
};

const generateAnnounce = (sentences) => {
  const announce = shuffle(sentences).slice(0, getRandomInt(1, SENTENCES_MAX_COUNT)).join(` `);
  const shortAnnounce = announce.length > ANNOUNCE_SIZE ?
    `${announce.slice(0, ANNOUNCE_SIZE - THREE_DOTS_COUNT)}...` : announce;
  return shortAnnounce;
};

const generateFullText = (sentences) => {
  const fullText = shuffle(sentences).slice(0, getRandomInt(1, sentences.length)).join(` `);
  const shortFullText = fullText.length > FULLTEXT_SIZE ?
    `${fullText.slice(0, FULLTEXT_SIZE - THREE_DOTS_COUNT)}...` : fullText;
  return shortFullText;
};

const generateMockCategories = (count, categories) => {
  const shuffleCategories = shuffle(categories);
  const categoriesList = new Array(count).fill(` `).map((item, i) => shuffleCategories[i]);
  return categoriesList;
};

const generatePublication = (titles, sentences, comments, categories, users) => {
  const createDate = moment(getRandomDate()).format(`YYYY-MM-DD`);
  return {
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    createdAt: createDate,
    createDate,
    image: `examples/example0${getRandomInt(1, 8)}.jpg`,
    categories: generateMockCategories(getRandomInt(1, categories.length - 1), categories),
    comments: generateMockComments(getRandomInt(0, comments.length), comments, users[getRandomInt(0, users.length - 1)].email)
  };
};

const generatePublications = (count, titles, sentences, comments, categories, users) => {
  const articles = new Array(count).fill({}).map(() => generatePublication(titles, sentences, comments, categories, users));
  return articles;
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(EXIT_CODE.ERR);
    }
    logger.info(`Connection to database established`);

    const titles = await readMockData(path.resolve(__dirname, `./../../data/titles.txt`));
    const categories = await readMockData(path.resolve(__dirname, `./../../data/categories.txt`));
    const sentences = await readMockData(path.resolve(__dirname, `./../../data/sentences.txt`));
    const comments = await readMockData(path.resolve(__dirname, `./../../data/comments.txt`));
    const users = [
      {
        firstName: `Иван`,
        lastName: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `examples/avatar01.jpg`,
        isAuthor: true
      },
      {
        firstName: `Пётр`,
        lastName: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `examples/avatar02.jpg`,
        isAuthor: false
      }
    ];
    const count = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_MOCK_COUNT;
    const articles = generatePublications(countArticle, titles, sentences, comments, categories, users);
    return initDB(sequelize, {articles, categories, users});
  }
};
