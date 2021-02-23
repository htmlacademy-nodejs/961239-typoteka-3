'use strict';

const chalk = require(`chalk`);
const HELP_TEXT = `Программа запускает http-сервер и формирует файл с данными для API.
    
Гайд:
service.js <command>
Команды:
--version:            выводит номер версии
--help:               печатает этот текст
--generate <count>    формирует файл mocks.json`;

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.grey(HELP_TEXT));
  }
};

