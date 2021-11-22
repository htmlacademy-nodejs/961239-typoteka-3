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
          firstName: `Семен`,
          lastName: ` Семенов`,
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
        email: `artemov@example.com`,
        password: `artemov`,
        passwordRepeated: `artemov`,
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
        firstName: `Семен`,
        lastName: `Семенов`,
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
        email: `semenov@example.com`,
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

  test(`User firstname is Иван`, () => expect(response.body.firstName).toBe(`Иван`));
  test(`User lastname is Иванов`, () => expect(response.body.lastName).toBe(`Иванов`));
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
