'use strict';

const fs = require(`fs`);
const {EXIT_CODE} = require(`./../constants`);
const {getRandomInt, shuffle} = require(`./../utils/utils`);

const FILENAME = `./../../mock.json`;
const DEFAULT_MOCK_COUNT = 1;
const MAX_MOCK_COUNT = 1000;

const NOT_WORKING_TEXT = `Не удалось сгенерировать данные, приложение завершит свою работу.`;
const MANY_PUBL_TEXT = `Не больше 1000 публикаций`;
const SUCCESS_TEXT = `Данные сгенерированны. Новый файл создан.`;

const TITLE_PUBL = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const ANNOUNCE_PUBL = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];
const ANNOUNCE_MAX_COUNT = 5;

const NOW_DATE = new Date(Date.now());
const LOW_DATE = new Date(NOW_DATE.getFullYear(), NOW_DATE.getMonth() - 3, NOW_DATE.getDay());

const CATEGORY_PUBL = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const generatePublication = () => ({
  title: TITLE_PUBL[getRandomInt(0, TITLE_PUBL.length - 1)],
  announce: shuffle(ANNOUNCE_PUBL).slice(0, getRandomInt(1, ANNOUNCE_MAX_COUNT)).join(` `),
  fullText: shuffle(ANNOUNCE_PUBL).slice(0, getRandomInt(1, ANNOUNCE_PUBL.length)).join(` `),
  createDate: new Date(getRandomInt(LOW_DATE, NOW_DATE)),
  category: shuffle(CATEGORY_PUBL).slice(getRandomInt(0, CATEGORY_PUBL.length - 1))
});

const generatePublications = (count) => {
  return JSON.stringify(new Array(count).fill({}).map(generatePublication));
};

const writeMock = (data) => {
  fs.writeFile(FILENAME, data, (err) => {
    if (err) {
      console.error(NOT_WORKING_TEXT);
      process.exit(EXIT_CODE.ERROR);

    }
    console.info(SUCCESS_TEXT);
    process.exit(EXIT_CODE.SUCCESS);
  });
};

const createMockData = (param) => {
  const count = Number.parseInt(param, 10);
  if (Number.isNaN(count)) {
    const mock = generatePublications(DEFAULT_MOCK_COUNT);
    writeMock(mock);
    return;
  }

  if (count > MAX_MOCK_COUNT) {
    console.error(MANY_PUBL_TEXT);
    process.exit(EXIT_CODE.ERROR);
  }
  const mock = generatePublications(count);
  writeMock(mock);
};

module.exports = {
  name: `--generate`,
  run: createMockData
};

