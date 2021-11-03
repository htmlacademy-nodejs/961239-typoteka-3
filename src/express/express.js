'use strict';

const express = require(`express`);
const path = require(`path`);
const {URL} = require(`./../constants`);
const session = require(`express-session`);

const sequelize = require(`./../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const baseRouter = require(`./routes/baseRouter`);
const myRouter = require(`./routes/myRouter`);
const articlesRouter = require(`./routes/articlesRouter`);
const PUBLIC_PATH = path.resolve(__dirname, `public`);
const TEMPLATE_PATH = path.resolve(__dirname, `templates`);
const UPLOAD_PATH = path.resolve(__dirname, `upload`);
const cookieParser = require(`cookie-parser`);
const moment = require(`moment`);

const PORT = 8080;

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}


const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000,
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.locals.moment = moment;
app.use(express.urlencoded({extended: false}));
app.use(express.static(PUBLIC_PATH));
app.use(cookieParser());
app.use(`/media`, express.static(UPLOAD_PATH));
app.set(`views`, TEMPLATE_PATH);
app.set(`view engine`, `pug`);
app.use(URL.ARTICLES, articlesRouter);
app.use(URL.BASE, baseRouter);
app.use(URL.MY, myRouter);

app.use((req, res) => {
  res.status(404).render(`errors/404`);
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).render(`errors/500`);
});

app.listen(PORT);
