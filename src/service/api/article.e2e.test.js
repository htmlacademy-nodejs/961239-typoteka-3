'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`./../data-service/article`);
const CommentService = require(`./../data-service/comment`);
const {StatusCode, Messages} = require(`./../constants`);


const firstId = `E1QgVC`;
const secondId = `NyYjMU`;
const thirdId = `7QSr3N`;
const commentId = `_t4X_u`;
const mockData = [
  {
    "id": firstId,
    "title": `Обзор новейшего смартфона`,
    "announce": `Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "createDate": `2021-06-04T05:54:13.654Z`,
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
    "id": secondId,
    "title": `Борьба с прокрастинацией`,
    "announce": `Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов.`,
    "createDate": `2021-06-03T07:12:55.894Z`,
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
        "id": `va3wfi`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `bHjsO-`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `Nuzdkb`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `FRSWmO`,
        "text": `Совсем немного...`
      },
      {
        "id": `9F3jeO`,
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "id": thirdId,
    "title": `Как собрать камни бесконечности`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь.`,
    "createDate": `2021-05-02T00:41:31.915Z`,
    "categories": [
      `Железо`,
      `IT`,
      `За жизнь`,
      `Без рамки`
    ],
    "comments": [
      {
        "id": commentId,
        "text": `Согласен с автором!`
      },
      {
        "id": `MZYkrj`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `VblSrj`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "id": `VItjSl`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `N7B7RS`,
        "text": `Совсем немного...`
      }
    ]
  },
  {
    "id": `H9ZQog`,
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "createDate": `2021-06-02T17:23:40.921Z`,
    "categories": [
      `Деревья`
    ],
    "comments": [
      {
        "id": `_AecUg`,
        "text": `Согласен с автором!`
      },
      {
        "id": `nlBoGL`,
        "text": `Это где ж такие красоты?`
      },
      {
        "id": `bsfyEP`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `cYU1fa`,
        "text": `Это где ж такие красоты?`
      },
      {
        "id": `PPQGD1`,
        "text": `Согласен с автором!`
      },
      {
        "id": `YcjxL3`,
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "id": `EpaSsF`,
    "title": `Ёлки. История деревьев`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят.`,
    "fullText": `Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`,
    "createDate": `2021-04-20T18:46:22.071Z`,
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
        "id": `NijvDT`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `-JMAPq`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "id": `rTsTeC`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `gm0W4z`,
        "text": `Согласен с автором!`
      },
      {
        "id": `WVXrXF`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `xuRY-D`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `4fcHXa`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `ucy9h-`,
        "text": `Совсем немного...`
      },
      {
        "id": `TgH4lC`,
        "text": `Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
article(app, new ArticleService(mockData), new CommentService(mockData));


describe(`Return all articles`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`All articles found`, () => expect(response.body).toEqual(mockData));
});

describe(`Find specific article`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${firstId}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Article found`, () => expect(response.body).toEqual(mockData[0]));
});

describe(`Find non-existing article`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/testid`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});

describe(`Create new article with correct data`, () => {
  let response;
  let listResponse;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send({
        title: `Тестовый заголовок статьи.`,
        announce: `Тестовый анонс`,
        fullText: `С другой стороны, базовый вектор развития не даёт нам иного выбора, кроме определения направлений прогрессивного развития.`,
        createDate: `2021-04-16T10:02:37.120Z`,
        categories: [
          `Тестовая категория`
        ]
      });
    listResponse = await request(app)
    .get(`/articles`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.ARTICLE_CREATE));
  test(`Article found in articles list`, () => expect(listResponse.body[5]).toMatchObject({
    title: `Тестовый заголовок статьи.`,
    announce: `Тестовый анонс`,
    fullText: `С другой стороны, базовый вектор развития не даёт нам иного выбора, кроме определения направлений прогрессивного развития.`,
    createDate: `2021-04-16T10:02:37.120Z`,
    categories: [
      `Тестовая категория`
    ]
  }));
});

describe(`Create article without required parameters`, () => {
  let response;
  let articlesListResponse;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send({
        announce: `Некоторый анонс`,
        fullText: `Рыба`,
        createDate: `2021-04-16T10:02:37.120Z`,
        categories: [
          `Тестовая1`,
          `Тестовая2`
        ]
      });
    articlesListResponse = await request(app)
      .get(`/articles`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.BAD_REQUEST));
  test(`Article didn't create`, () => expect(articlesListResponse.body).toHaveLength(6));
});

describe(`Edit article with correct data`, () => {
  let response;
  let articleDataResponse;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${firstId}`)
      .send({
        "id": `Testid`,
        "title": `Тест заголовок`,
        "announce": `Некоторый анонс`,
        "fullText": `Рыба`,
        "createDate": `2021-04-16T10:02:37.120Z`,
        "categories": [
          `Тестовая1`,
          `Тестовая2`
        ],
        "test": `true`,
        "comments": [
          {
            "id": `newnew`,
            "text": `Ошибочный коммент`
          }
        ]
      });
    articleDataResponse = await request(app)
      .get(`/articles/${firstId}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.ARTICLE_EDIT));
  test(`Article edited`, async () => expect(articleDataResponse.body).toMatchObject({
    id: firstId,
    title: `Тест заголовок`,
    announce: `Некоторый анонс`,
    fullText: `Рыба`,
    createDate: `2021-06-04T05:54:13.654Z`,
    categories: [
      `Тестовая1`,
      `Тестовая2`
    ],
    comments: []
  })
  );
  test(`Wrong parameter didn't add`, () => expect(articleDataResponse.body).not.toMatchObject({test: true}));
});


describe(`Edit non-existing article`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/nonexistid`)
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

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${secondId}`)
      .send({});
    articleDataResponse = await request(app)
      .get(`/articles/${secondId}`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.BAD_REQUEST));
  test(`Article didn't edited`, () => expect(articleDataResponse.body).toEqual(mockData[1]));
});


describe(`Delete article`, () => {
  let response;
  let articleDataResponse;
  let articlesListResponse;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${secondId}`);
    articleDataResponse = await request(app)
      .get(`/articles/${secondId}`);
    articlesListResponse = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.ARTICLE_DELETE));
  test(`Article doesn't exist anymore`, () => expect(articleDataResponse.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Article isn't in the offers list`, () => expect(articlesListResponse.body).toHaveLength(5));
});

describe(`Return comments list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${thirdId}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Get comments`, () => expect(response.body).toEqual(mockData[mockData.findIndex((elem) => elem.id === thirdId)].comments));
});

describe(`Add new comment`, () => {
  let response;
  let commentsListResponse;
  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${thirdId}/comments`)
      .send({
        "test": true,
        "id": `testtesttest`,
        "text": `New comment`
      });
    commentsListResponse = await request(app)
      .get(`/articles/${thirdId}/comments`);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(parseInt(StatusCode.CREATED, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.COMMENT_ADD));
  test(`New comment added`, () => expect(commentsListResponse.body).toHaveLength(6));
  test(`Comment include correct message`, () => expect(commentsListResponse.body[5].text).toEqual(`New comment`));
  test(`Correct id created`, () => expect(commentsListResponse.body[5].id).not.toEqual(`testtesttest`));
  test(`Wrong data didn't add`, () => expect(commentsListResponse.body[5]).not.toMatchObject({test: true}));
});

describe(`Add comment with wrong data`, () => {
  let response;
  let commentsListResponse;

  beforeAll(async () => {
    response = await request(app)
    .post(`/articles/${thirdId}/comments`)
    .send({});
    commentsListResponse = await request(app)
    .get(`/articles/${thirdId}/comments`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(parseInt(StatusCode.BADREQUEST, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.BAD_REQUEST));
  test(`Comment didn't create`, () => expect(commentsListResponse.body).toHaveLength(6));
});

describe(`Add comment to non-existing offer`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
    .post(`/articles/nonexistid/comments`)
    .send({
      "text": `New comment`
    });
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});

describe(`Delete comment`, () => {
  let response;
  let commentsListResponse;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${thirdId}/comments/${commentId}`);
    commentsListResponse = await request(app)
      .get(`/articles/${thirdId}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(parseInt(StatusCode.OK, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.COMMENT_DELETE));
  test(`Comment deleted`, () => expect(commentsListResponse.body).toHaveLength(5));
  test(`Deleted comment doesn't exist`, () => expect(commentsListResponse.body.find((elem) => elem.id === commentId)).toBeUndefined());
});

describe(`Delete non-existing comment`, () => {
  let response;
  let commentsListResponse;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${thirdId}/comments/nonexistid`);
    commentsListResponse = await request(app)
      .get(`/articles/${thirdId}/comments`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_COMMENT));
  test(`Count of comments doesn't change`, () => expect(commentsListResponse.body).toHaveLength(5));
});

describe(`Delete comment in non-existing offer`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/nonexistid/comments/nonexistid`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(parseInt(StatusCode.NOTFOUND, 10)));
  test(`Response contains correct message`, () => expect(response.text).toEqual(Messages.NOT_FOUND_ARTICLE));
});
