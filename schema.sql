CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  post_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  like_count INT DEFAULT 0
);


CREATE TABLE post_likes (
  post_id INT,
  user_id INT,
  PRIMARY KEY (post_id, user_id)
);

-- Link the username in users table with user_id in posts table
SELECT posts.*, users.username
FROM posts
INNER JOIN users ON posts.user_id = users.id;
