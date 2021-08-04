INSERT INTO roles (name)
VALUES ('guest'),
('reader'),
('author');

INSERT INTO articles (title, created_date, announce, full_text, image)
VALUES (
  'Обзор новейшего смартфона',
  '2021-07-04T19:58:17+00:00',
  'Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов.',
  'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.',
  'example01.jpg'),
  (
  'Борьба с прокрастинацией',
  '2020-08-11T00:00:09+00:00',
  'Он написал больше 30 хитов.',
  'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция.',
  'example02.jpg'
  ),
  (
  'Как собрать камни бесконечности',
  '2021-03-22T10:00:22+00:00',
  'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
  'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.',
  'example03.jpg');

INSERT INTO categories (name)
VALUES ('IT'),
  ('Железо'),
  ('За жизнь'),
  ('Без рамки'),
  ('Деревья'),
  ('Кино');

ALTER TABLE users DISABLE TRIGGER ALL;
INSERT INTO users (email, firstname, lastname, password, avatar, role_id)
VALUES (
  'test_andrew@mail.com',
  'Andrew',
  'Testov',
  '5f4dcc3b5aa765d61d8327deb882cf99',
  'example04.jpg',
  3),
  (
  'test_ann@mail.com',
  'Ann',
  'Narrow',
  '5f4dcc3b5aa765d61d8327deb882cf99',
  'example05.jpg',
  2
  ),
  (
  'test_josh@mail.com',
  'Josh',
  'Shepard',
  '5f4dcc3b5aa765d61d8327deb882cf99',
  'example06.jpg',
  2
  ),
  (
  'test_teest@mail.com',
  'Test',
  'Testov',
  '5f4dcc3b5aa765d61d8327deb882cf99',
  'example07.jpg',
  2
  );
ALTER TABLE users ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments (user_id, article_id, date, message)
VALUES (
  4,
  1,
  '2021-06-25T10:10:22+00:00',
  'Согласен с автором!'
  ),
  (
  3,
  1,
  '2021-04-09T16:05:59+00:00',
  'Это где ж такие красоты?'
  ),
  (
  1,
  2,
  '2021-04-09T12:05:03+00:00',
  'Мне кажется или я уже читал это где-то?'
  ),
  (
  2,
  2,
  '2021-01-01T00:30:50+00:00',
  'Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.'
  ),
  (
  2,
  3,
  '2021-02-26T10:07:36+00:00',
  'Планируете записать видосик на эту тему?'
  ),
  (
  3,
  3,
  '2021-07-21T23:59:17+00:00',
  'Совсем немного...'
  );
ALTER TABLE comments ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories (category_id, article_id)
VALUES (
  1,
  1
),
(
  2,
  1
),
(
  3,
  1
),
(
  5,
  1
),
(
  6,
  1
),
(
  3,
  2
),
(
  4,
  3
),
(
  5,
  3
),
(
  1,
  3
);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;