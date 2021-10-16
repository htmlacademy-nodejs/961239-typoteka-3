'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`./../lib/init-db`);
const article = require(`./article`);
const ArticleService = require(`./../data-service/article`);
const CommentService = require(`./../data-service/comment`);
const {StatusCode, Messages} = require(`./../../constants`);

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

const mockData = [
  {
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
  await initDB(mockDB, {categories: mockCategories, articles: mockData});

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
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});

describe(`Create new article with correct data`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send({
        title: `Тестовый заголовок статьи.`,
        announce: `Тестовый анонс`,
        fullText: `Тестовый полный текст.`,
        categories: [1]
      });
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
  test(`Article has correct title`, () => expect(response.body.title).toEqual(`Тестовый заголовок статьи.`));
  test(`Article has correct announce`, () => expect(response.body.announce).toEqual(`Тестовый анонс`));
  test(`Article has correct fullText`, () => expect(response.body.fullText).toEqual(`Тестовый полный текст.`));
});

describe(`Edit article with correct data`, () => {
  let response;
  let articleDataResponse;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/1`)
      .send({
        "title": `Тест заголовок`,
        "announce": `Некоторый анонс`,
        "fullText": `Рыба`,
        "categories": [5, 3]
      });
    articleDataResponse = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Article has correct title`, async () => expect(articleDataResponse.body.title).toEqual(`Тест заголовок`));
  test(`Article has correct announce`, async () => expect(articleDataResponse.body.announce).toEqual(`Некоторый анонс`));
  test(`Article has correct full text`, async () => expect(articleDataResponse.body.fullText).toEqual(`Рыба`));
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
        "text": `New comment`
      });
    commentsListResponse = await request(app)
      .get(`/articles/3/comments`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
  test(`New comment added`, () => expect(commentsListResponse.body).toHaveLength(6));
  test(`Comment include correct message`, () => expect(commentsListResponse.body[5].text).toEqual(`New comment`));
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

// временный файл, в котором хранятся все тесты на валидацию
// т.к. валидация запросов на данном этапе
// не должна работать
/*
describe(`Create article without required parameters`, () => {
  let response;
  let articlesListResponse;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send({
        announce: `Некоторый анонс`,
        fullText: `Рыба`,
        categories: [1, 2]
      });
    articlesListResponse = await request(app)
      .get(`/articles`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.BAD_REQUEST));
  test(`Article didn't create`, () => expect(articlesListResponse.body).toHaveLength(6));
});

describe(`Edit non-existing article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/3333444`)
      .send({
        "title": `Тест заголовок`,
        "announce": `Некоторый анонс`,
        "fullText": `Рыба`,
        "createDate": `2021-04-16T10:02:37.120Z`,
        "categories": [
          `Тестовая1`,
          `Тестовая2`
        ]
      });
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});

describe(`Edit article without require data`, () => {
  let response;
  let articleDataResponse;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send({});
    articleDataResponse = await request(app)
      .get(`/articles/2`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.BAD_REQUEST));
  test(`Article didn't edited`, () => expect(articleDataResponse.body.title).toEqual(`Борьба с прокрастинацией`));
});

describe(`Add comment with wrong data`, () => {
  let response;
  let commentsListResponse;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles/3/comments`)
    .send({});
    commentsListResponse = await request(app)
    .get(`/articles/3/comments`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.BAD_REQUEST));
  test(`Comment didn't create`, () => expect(commentsListResponse.body).toHaveLength(6));
});

describe(`Add comment to non-existing offer`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles/nonexistid/comments`)
    .send({
      "text": `New comment`
    });
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});


describe(`Delete non-existing comment`, () => {
  let response;
  let commentsListResponse;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/3/comments/nonexistid`);
    commentsListResponse = await request(app)
      .get(`/articles/3/comments`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_COMMENT));
  test(`Count of comments doesn't change`, () => expect(commentsListResponse.body).toHaveLength(5));
});

describe(`Delete comment in non-existing offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/nonexistid/comments/nonexistid`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});
*/
