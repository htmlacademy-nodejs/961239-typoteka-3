'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`./../lib/init-db`);
const article = require(`./article`);
const ArticleService = require(`./../data-service/article`);
const CommentService = require(`./../data-service/comment`);
const {StatusCode, ServerMessages} = require(`./../../constants`);

const passwordUtils = require(`./../lib/password`);

const PLACEHOLDER_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const mockCategories = [
  `Без рамки`,
  `IT`,
  `Деревья`,
  `Железо`,
  `За жизнь`,
  `Разное`,
  `Музыка`,
  `Кино`,
  `Программирование`
];

const mockUsers = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `examples/avatar01.jpg`,
    isAuthor: true
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `examples/avatar02.jpg`,
    isAuthor: false
  }
];

const mockData = [
  {
    title: `Рок — это протест`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежеднев...`,
    createdAt: `2021-09-28`,
    createDate: `2021-09-28`,
    image: `examples/example08.jpg`,
    categories: [
      `Без рамки`,
      `Музыка`,
      `Железо`,
      `Программирование`,
      `За жизнь`,
      `Разное`,
      `Деревья`,
      `Кино`
    ],
    comments: [
      {
        message: `Согласен с автором!`,
        user: `ivanov@example.com`
      },
      {
        message: `Согласен с автором!`,
        user: `ivanov@example.com`
      },
      {
        message: `Мне кажется или я уже читал это где-то?`,
        user: `ivanov@example.com`
      },
      {
        message: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        user: `ivanov@example.com`
      },
      {
        message: `Плюсую, но слишком много буквы!`,
        user: `ivanov@example.com`
      },
      {
        message: `Согласен с автором!`,
        user: `ivanov@example.com`
      },
      {
        message: `Это где ж такие красоты?`,
        user: `ivanov@example.com`
      },
      {
        message: `Хочу такую же футболку :-)`,
        user: `ivanov@example.com`
      }
    ]
  },
  {
    title: `Ёлки. История деревьев`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    createdAt: `2021-10-20`,
    createDate: `2021-10-20`,
    image: `examples/example03.jpg`,
    categories: [
      `Деревья`,
      `За жизнь`,
      `Программирование`,
      `Разное`,
      `Без рамки`
    ],
    comments: [
      {
        message: `Согласен с автором!`,
        user: `ivanov@example.com`
      },
      {
        message: `Согласен с автором!`,
        user: `ivanov@example.com`
      },
      {
        message: `Планируете записать видосик на эту тему?`,
        user: `ivanov@example.com`
      },
      {
        message: `Планируете записать видосик на эту тему?`,
        user: `ivanov@example.com`
      },
      {
        message: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        user: `ivanov@example.com`
      },
      {
        message: `Мне кажется или я уже читал это где-то?`,
        user: `ivanov@example.com`
      },
      {
        message: `Совсем немного...`,
        user: `ivanov@example.com`
      }
    ]
  },
  {
    title: `Лучшие рок-музыканты 20-века`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    createdAt: `2021-09-01`,
    createDate: `2021-09-01`,
    image: `examples/example06.jpg`,
    categories: [
      `Без рамки`
    ],
    comments: [
      {
        message: `Мне кажется или я уже читал это где-то?`,
        user: `petrov@example.com`
      },
      {
        message: `Мне кажется или я уже читал это где-то?`,
        user: `petrov@example.com`
      },
      {
        message: `Это где ж такие красоты?`,
        user: `petrov@example.com`
      },
      {
        message: `Мне кажется или я уже читал это где-то?`,
        user: `petrov@example.com`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());


beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});

  article(app, new ArticleService(mockDB), new CommentService(mockDB));
});

describe(`Return all articles`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`All articles found`, () => expect(response.body).toHaveLength(5));
});

describe(`Find specific article`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Article found`, () => expect(response.body.title).toEqual(`Обзор новейшего смартфона`));
});

describe(`Find non-existing article`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/555555`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(ServerMessages.NOT_FOUND_ARTICLE));
});

describe(`Create new article with correct data`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send({
        title: `Тестовый заголовок статьи. 1234567890`,
        announce: `Тестовый анонс статьи. 1234567890`,
        fullText: `Тестовый полный текст. 1234567890`,
        categories: [1]
      });
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
  test(`Article has correct title`, () => expect(response.body.title).toEqual(`Тестовый заголовок статьи. 1234567890`));
  test(`Article has correct announce`, () => expect(response.body.announce).toEqual(`Тестовый анонс статьи. 1234567890`));
  test(`Article has correct fullText`, () => expect(response.body.fullText).toEqual(`Тестовый полный текст. 1234567890`));
});

describe(`Edit article with correct data`, () => {
  let response;
  let articleDataResponse;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/1`)
      .send({
        title: `Тестовый заголовк не менее 30 символов`,
        announce: `Некоторый анонс не менее 30 символов`,
        fullText: PLACEHOLDER_TEXT,
        categories: [5, 3]
      });
    articleDataResponse = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Article has correct title`, async () => expect(articleDataResponse.body.title).toEqual(`Тестовый заголовк не менее 30 символов`));
  test(`Article has correct announce`, async () => expect(articleDataResponse.body.announce).toEqual(`Некоторый анонс не менее 30 символов`));
  test(`Article has correct full text`, async () => expect(articleDataResponse.body.fullText).toEqual(PLACEHOLDER_TEXT));
  test(`Article has correct count of categories`, async () => expect(articleDataResponse.body.categories).toHaveLength(2));
});

describe(`Delete article`, () => {
  let response;
  let articleDataResponse;
  let articlesListResponse;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/2`);
    articleDataResponse = await request(app)
      .get(`/articles/2`);
    articlesListResponse = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Article doesn't exist anymore`, () => expect(articleDataResponse.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Article isn't in the offers list`, () => expect(articlesListResponse.body).toHaveLength(5));
});

describe(`Return comments list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/3/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Comments have correct count`, () => expect(response.body).toHaveLength(5));
});

describe(`Add new comment`, () => {
  let response;
  let commentsListResponse;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/3/comments`)
      .send({
        message: `New comment with 20 symbols`,
        userId: 2
      });
    commentsListResponse = await request(app)
      .get(`/articles/3/comments`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
  test(`New comment added`, () => expect(commentsListResponse.body).toHaveLength(6));
  test(`Comment include correct message`, () => expect(commentsListResponse.body[5].message).toEqual(`New comment with 20 symbols`));
});

describe(`Delete comment`, () => {
  let response;
  let commentsListResponse;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/3/comments/6`);
    commentsListResponse = await request(app)
      .get(`/articles/3/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Comment deleted`, () => expect(commentsListResponse.body).toHaveLength(5));
  test(`Deleted comment doesn't exist`, () => expect(commentsListResponse.body.find((elem) => elem.id === 1)).toBeUndefined());
});
