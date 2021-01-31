'use strict';

const {Cli} = require(`./cli`);
const {DEFAULT_COMMAND, USER_ARVG_INDEX, NOT_COMMAND_TEXT, EXIT_CODE} = require(`./constants`);

const userArguments = process.argv.slice(USER_ARVG_INDEX);
const [userCommand, userParameter] = userArguments;

if (userArguments.length === 0) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(EXIT_CODE.SUCCESS);
}

if (!Cli[userCommand]) {
  console.error(NOT_COMMAND_TEXT);
  process.exit(EXIT_CODE.ERROR);
}

Cli[userCommand].run(userParameter);
