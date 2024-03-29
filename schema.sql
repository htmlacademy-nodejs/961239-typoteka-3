CREATE TABLE users
(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email character varying(100) NOT NULL,
    firstname character varying(100) NOT NULL,
    lastname character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    avatar text
);

CREATE TABLE articles
(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id int NOT NULL,
    title character varying(250) NOT NULL,
    created_date timestamp DEFAULT current_timestamp,
    announce character varying(250) NOT NULL,
    full_text character varying(1000),
    image text
    CONSTRAINT authors FOREIGN KEY (author_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE categories
(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name character varying(30) NOT NULL
);

CREATE TABLE articles_categories
(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    article_id int NOT NULL,
    category_id int NOT NULL,
    CONSTRAINT categories FOREIGN KEY (category_id)
        REFERENCES categories (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT articles FOREIGN KEY (article_id)
        REFERENCES articles (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE comments
(
    id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id int NOT NULL,
    article_id int NOT NULL,
    date timestamp DEFAULT current_timestamp,
    message text NOT NULL,
    CONSTRAINT users FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT articles FOREIGN KEY (article_id)
        REFERENCES articles (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX article_name
    ON articles USING btree
    (title);