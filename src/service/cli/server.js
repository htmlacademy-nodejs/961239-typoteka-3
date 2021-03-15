'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const http = require(`http`);

const DEFAULT_PORT = 3000;
const MOCK_DATA_PATH = `./../../mock.json`;

const NOT_FOUND_MESSAGE = `Not found`;

const URL = {
  MAIN: `/`
};

const StatusCode = {
  OK: `200`,
  NOTFOUND: `404`
};

const readMockFile = async () => {
  const mockData = await fs.readFile(MOCK_DATA_PATH, `utf-8`);
  const mockDataArray = JSON.parse(mockData);
  const htmlTitles = new Array(0);
  mockDataArray.forEach((mock) => {
    htmlTitles.push(`<ul><li>${mock.title}</li></ul>`);
  });
  return htmlTitles;
};

const sendResponse = (response, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  response.statusCode = statusCode;
  response.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  response.end(template);
};

const onClientConnect = async (request, response) => {
  switch (request.url) {
    case URL.MAIN:
      const mockTitles = await readMockFile();
      if (mockTitles.length) {
        sendResponse(response, StatusCode.OK, `${mockTitles.join(``)}`);
      } else {
        sendResponse(response, StatusCode.NOTFOUND, NOT_FOUND_MESSAGE);
      }
      break;
    default:
      sendResponse(response, StatusCode.NOTFOUND, NOT_FOUND_MESSAGE);
  }

};

const serverInit = (port) => {
  const httpServer = http.createServer(onClientConnect);
  httpServer.listen(port).on(`listening`, (err) => {
    if (err) {
      return console.error(`Ошибка при создании сервера`, err);
    }

    return console.info(chalk.green(`Ожидание соединений на порт ${port}`));
  });
};

const serverStart = (param) => {
  const portNum = Number.parseInt(param, 10);
  if (Number.isNaN(portNum)) {
    serverInit(DEFAULT_PORT);
    return;
  }
  serverInit(portNum);
};

module.exports = {
  name: `--server`,
  run: serverStart
};
