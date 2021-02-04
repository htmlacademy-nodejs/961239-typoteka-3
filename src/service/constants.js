'use strict';

const DEFAULT_COMMAND = `--version`;
const USER_ARVG_INDEX = 2;
const NOT_COMMAND_TEXT = `Команда не найдена. Приложение завершит свою работу`;
const EXIT_CODE = {
  SUCCESS: 0,
  ERROR: 1
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARVG_INDEX,
  NOT_COMMAND_TEXT,
  EXIT_CODE
};
