'use strict';

const express = require(`express`);
const path = require(`path`);
const {URL} = require(`./../constants`);
const baseRouter = require(`./routes/baseRouter`);
const myRouter = require(`./routes/myRouter`);
const articlesRouter = require(`./routes/articlesRouter`);
const PUBLIC_PATH = path.resolve(__dirname, `public`);
const TEMPLATE_PATH = path.resolve(__dirname, `templates`);
const UPLOAD_PATH = path.resolve(__dirname, `upload`);
const cookieParser = require(`cookie-parser`);
const moment = require(`moment`);

const PORT = 8080;

const app = express();

app.locals.moment = moment;
app.use(express.static(PUBLIC_PATH));
app.use(cookieParser());
app.use(`/media`, express.static(UPLOAD_PATH));
app.set(`views`, TEMPLATE_PATH);
app.set(`view engine`, `pug`);
app.use(URL.ARTICLES, articlesRouter);
app.use(URL.BASE, baseRouter);
app.use(URL.MY, myRouter);

app.use((req, res) => {
  res.status(404).render(`404`);
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).render(`500`);
});

app.listen(PORT);
