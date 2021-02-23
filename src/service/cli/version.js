'use strict';

const chalk = require(`chalk`);
const packageJsonFile = require(`./../../../package.json`);
const version = packageJsonFile.version;

module.exports = {
  name: `--version`,
  run() {
    console.info(`Версия приложения: ${chalk.blue(version)}`);
  }
};
