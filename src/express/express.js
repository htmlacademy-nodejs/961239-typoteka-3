'use strict';

const express = require(`express`);
const {URL} = require(`./../service/constants`);
const baseRouter = require(`./routes/baseRouter`);
const myRouter = require(`./routes/myRouter`);
const articlesRouter = require(`./routes/articlesRouter`);

const PORT = 8080;

const app = express();

app.use(URL.ARTICLES, articlesRouter);
app.use(URL.BASE, baseRouter);
app.use(URL.MY, myRouter);

app.listen(PORT);
