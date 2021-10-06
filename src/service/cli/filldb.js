'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const {EXIT_CODE, ANNOUNCE_SIZE, FULLTEXT_SIZE} = require(`./../constants`);
const {getRandomInt, shuffle, getRandomDate} = require(`../utils/dev-utils`);
const {getLogger} = require(`./../lib/logger`);
const sequelize = require(`./../lib/sequelize`);
const initDB = require(`./../lib/init-db`);

const logger = getLogger({name: `api`});

const readMockData = async (dataPath) => {
  const mockData = await fs.readFile(dataPath, `utf-8`);
  return mockData.split(`\n`);
};

const SENTENCES_MAX_COUNT = 5;
const DEFAULT_MOCK_COUNT = 1;

const generateMockComments = (count, comments) => {
  const commentsList = new Array(count).fill(` `).map(() =>({
    text: comments[getRandomInt(0, comments.length - 1)]
  }));
  return commentsList;
};

const generateAnnounce = (sentences) => {
  const announce = shuffle(sentences).slice(0, getRandomInt(1, SENTENCES_MAX_COUNT)).join(` `);
  const shortAnnounce = announce.length > ANNOUNCE_SIZE ?
    `${announce.slice(0, ANNOUNCE_SIZE - 3)}...` : announce;
  return shortAnnounce;
};

const generateFullText = (sentences) => {
  const fullText = shuffle(sentences).slice(0, getRandomInt(1, sentences.length)).join(` `);
  const shortFullText = fullText.length > FULLTEXT_SIZE ?
    `${fullText.slice(0, FULLTEXT_SIZE - 3)}...` : fullText;
  return shortFullText;
};

const generateMockCategories = (count, categories) => {
  const shuffleCategories = shuffle(categories);
  const categoriesList = new Array(count).fill(` `).map((item, i) => shuffleCategories[i]);
  return categoriesList;
};

const generatePublication = (titles, sentences, comments, categories) => ({
  title: titles[getRandomInt(0, titles.length - 1)],
  announce: generateAnnounce(sentences),
  fullText: generateFullText(sentences),
  createdAt: getRandomDate(),
  image: `example0${getRandomInt(1, 4)}.jpg`,
  categories: generateMockCategories(getRandomInt(1, categories.length - 1), categories),
  comments: generateMockComments(getRandomInt(0, comments.length), comments)
});

const generatePublications = (count, titles, sentences, comments, categories) => {
  const articles = new Array(count).fill({}).map(() => generatePublication(titles, sentences, comments, categories));
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

    const count = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_MOCK_COUNT;
    const articles = generatePublications(countArticle, titles, sentences, comments, categories);
    return initDB(sequelize, {articles, categories});
  }
};
