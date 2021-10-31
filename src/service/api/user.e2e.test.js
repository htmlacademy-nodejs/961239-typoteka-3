'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`./../lib/init-db`);
const {StatusCode} = require(`./../../constants`);

const passwordUtils = require(`./../lib/password`);

const user = require(`./user`);
const UserService = require(`../data-service/user`);

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
    "user": `ivanov@example.com`,
    "title": `Обзор новейшего смартфона`,
    "announce": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
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
    "comments": []
  },
  {
    "user": `ivanov@example.com`,
    "title": `Борьба с прокрастинацией`,
    "announce": `Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов.`,
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
        "user": `petrov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "title": `Как собрать камни бесконечности`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь.`,
    "categories": [
      `Железо`,
      `IT`,
      `За жизнь`,
      `Без рамки`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "categories": [
      `Деревья`
    ],
    "comments": [
      {
        "user": `sidorov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты?`
      },
      {
        "text": `Согласен с автором!`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "title": `Ёлки. История деревьев`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят.`,
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`,
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
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Совсем немного...`
      },
      {
        "user": `sidorov@example.com`,
        "text": `Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDB));
  return app;
};


describe(`Create user with valid data`, () => {
  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app)
        .post(`/user`)
        .send({
          name: `Семен Семенов`,
          email: `semenov@example.com`,
          password: `semenov`,
          passwordRepeated: `semenov`,
          avatar: `avatar04.jpg`
        });
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
});

describe(`Return error if data doesn't have required field`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        email: `semenov@example.com`,
        password: `semenov`,
        passwordRepeated: `semenov`,
        avatar: `example04.jpg`
      });
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
});

describe(`Return error if data is invalid`, () => {

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        name: `Семен Семенов`,
        email: `semenov`,
        password: `semenov`,
        passwordRepeated: `semenov`,
        avatar: `example04.jpg`
      });
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
});

describe(`Return error if passwords don't match`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        name: `Семен Семенов`,
        email: `semenov`,
        password: `semenov`,
        passwordRepeated: `semenov2`,
        avatar: `example04.jpg`
      });
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
});

describe(`Return error if email is already used`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({
        name: `Семен Семенов`,
        email: `semenov`,
        password: `semenov`,
        passwordRepeated: `semenov2`,
        avatar: `example04.jpg`
      });
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
});

describe(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send(validAuthData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));

  test(`User name is Иван Иванов`, () => expect(response.body.name).toBe(`Иван Иванов`));
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badAuthData = {
      email: `not-exist@example.com`,
      password: `petrov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(parseInt(StatusCode.UNAUTHORIZED, 10));
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      email: `petrov@example.com`,
      password: `ivanov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(parseInt(StatusCode.UNAUTHORIZED, 10));
  });
});
