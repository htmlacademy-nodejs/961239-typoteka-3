SELECT id, name FROM categories;

SELECT id, name FROM categories WHERE id IN (SELECT category_id FROM articles_categories);

SELECT 
  ac.category_id, 
  c.name,
  COUNT(ac.category_id)
FROM articles_categories AS ac 
LEFT JOIN categories AS c ON c.id = ac.category_id
GROUP BY ac.category_id, c.id;

SELECT a.id, a.title, a.announce, a.created_date,
	concat(u.firstname, u.lastname, ' '), u.email,
	COUNT(DISTINCT com.id),
	STRING_AGG(DISTINCT cat.name, ', ')
FROM articles AS a
LEFT JOIN comments AS com ON a.id = com.article_id
INNER JOIN users AS u ON a.author_id = u.id
INNER JOIN articles_categories as ac ON a.id = ac.article_id
INNER JOIN categories as cat ON cat.id = ac.category_id
GROUP BY a.id, u.id, com.article_id, ac.article_id
ORDER BY created_date DESC;

SELECT a.id, a.title, a.announce, a.full_text, a.created_date, a.image,
	concat(u.firstname, u.lastname, ' '), u.email,
	COUNT(DISTINCT com.id),
	STRING_AGG(DISTINCT cat.name, ', ')
FROM articles AS a
LEFT JOIN comments AS com ON a.id = com.article_id
INNER JOIN users AS u ON a.author_id = u.id
INNER JOIN articles_categories as ac ON a.id = ac.article_id
INNER JOIN categories as cat ON cat.id = ac.category_id
WHERE a.id = 1
GROUP BY a.id, u.id, com.article_id, ac.article_id;

SELECT 
	com.id, com.article_id, 
	concat(u.firstname, ' ', u.lastname), 
	com.message 
FROM comments AS com
INNER JOIN users AS u ON com.user_id = u.id
ORDER BY date DESC
LIMIT 5;

SELECT 
	com.id, com.article_id, 
	concat(u.firstname, ' ', u.lastname), 
	com.message 
FROM comments AS com
INNER JOIN users AS u ON com.user_id = u.id
WHERE com.article_id = 1
ORDER BY date DESC;

UPDATE articles
SET title='Как я встретил Новый год'
WHERE ID = 3;