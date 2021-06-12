'use strict';

const fs = require(`fs`).promises;

const path = require(`path`);
const MOCK_DATA_PATH = path.resolve(__dirname, `./../../../mock.json`);

const readData = async () => {
  const mockData = await fs.readFile(MOCK_DATA_PATH, `utf-8`);
  const parseData = JSON.parse(mockData);
  return Promise.resolve(parseData);
};

module.exports = {readData};
