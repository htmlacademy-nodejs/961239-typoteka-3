'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const search = require(`./search`);
const SearchService = require(`./../data-service/search`);
const {StatusCode} = require(`./../../constants`);
const initDB = require(`./../lib/init-db`);
const passwordUtils = require(`./../lib/password`);

const mockCategories = [
  `IT`,
  `Музыка`,
  `Кино`,
  `Железо`,
  `Программирование`,
  `За жизнь`,
  `Деревья`,
  `Без рамки`,
  `Разное`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  },
  {
    name: `Сидор Сидоров`,
    email: `sidorov@example.com`,
    passwordHash: passwordUtils.hashSync(`sidorov`),
    avatar: `avatar03.jpg`
  }
];

const mockData = [
  {
    "title": `Обзор новейшего смартфона`,
    "announce": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "createdAt": `2021-06-04T05:54:13.654Z`,
    "categories": [
      `IT`,
      `Музыка`,
      `Кино`,
      `Железо`,
      `Программирование`,
      `За жизнь`,
      `Деревья`,
      `Без рамки`
    ],
    "comments": [
    ]
  },
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов.`,
    "createdAt": `2021-06-03T07:12:55.894Z`,
    "categories": [
      `Кино`,
      `За жизнь`,
      `IT`,
      `Железо`,
      `Без рамки`,
      `Деревья`,
      `Разное`,
      `Музыка`,
      `Программирование`
    ],
    "comments": [
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "text": `Совсем немного...`
      },
      {
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь.`,
    "createdAt": `2021-05-02T00:41:31.915Z`,
    "categories": [
      `Железо`,
      `IT`,
      `За жизнь`,
      `Без рамки`
    ],
    "comments": [
      {
        "text": `Согласен с автором!`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "createdAt": `2021-06-02T17:23:40.921Z`,
    "categories": [
      `Деревья`
    ],
    "comments": [
      {
        "text": `Согласен с автором!`
      },
      {
        "text": `Это где ж такие красоты?`
      },
      {
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Это где ж такие красоты?`
      },
      {
        "text": `Согласен с автором!`
      },
      {
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "title": `Ёлки. История деревьев`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят.`,
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`,
    "createdAt": `2021-04-20T18:46:22.071Z`,
    "categories": [
      `Разное`,
      `Деревья`,
      `Железо`,
      `Программирование`,
      `Кино`,
      `Без рамки`,
      `Музыка`,
      `IT`,
      `За жизнь`
    ],
    "comments": [
      {
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Согласен с автором!`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "text": `Совсем немного...`
      },
      {
        "text": `Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];


const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
  search(app, new SearchService(mockDB));
});

describe(`API returns article based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
          .get(`/search`)
          .query({
            query: `Обзор`
          });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`1 article found`, () => expect(response.body).toHaveLength(1));
  test(`Article has correct name`, () => expect(response.body[0].title).toBe(`Обзор новейшего смартфона`));
});

describe(`API returns articles based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
          .get(`/search`)
          .query({
            query: `на`
          });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`2 articles found`, () => expect(response.body).toHaveLength(2));
});

describe(`API returns no result based on search query which not match`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
          .get(`/search`)
          .query({
            query: `Тестовая строка`
          });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
});
