'use strict';

const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./filldb`);
const fill = require(`./fill`);
const server = require(`./server`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
  [fill.name]: fill,
  [server.name]: server
};

module.exports = Cli;
