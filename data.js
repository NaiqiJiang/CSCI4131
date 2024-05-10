const mysql = require('mysql-await');
const bcrypt = require('bcrypt');
const change = 7;

var connPool = mysql.createPool({
    connectionLimit: 5,
    host: 'cse-mysql-classes-01.cse.umn.edu',
    user: 'C4131F23U97',
    password: '9459',
    database: 'C4131F23U97'
});

async function registerUser(username, email, password, answer1, answer2, answer3) {
  try {
    const hashedPassword = await bcrypt.hash(password, change);
    const query = "INSERT INTO users (username, email, password, userPhotoPath, securityQuestion1Answer, securityQuestion2Answer, securityQuestion3Answer) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const defaultPhotoPath = '/resources/images/defaultUserPhoto.png';
    await connPool.awaitQuery(query, [username, email, hashedPassword, defaultPhotoPath, answer1, answer2, answer3]);
    return { success: true };
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
}

async function CheckUser(username, password) {
  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const users = await connPool.awaitQuery(query, [username]);
    if (users.length === 0) {
      return { success: false, message: "Username or Password invalid." };
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return { success: true, user: { id: user.id, username: user.username } };
    } else {
      return { success: false, message: "Incorrect password." };
    }
  } catch (error) {
    console.error('Error in CheckUser:', error);
    throw error;
  }
}

async function getUserByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const users = await connPool.awaitQuery(query, [username]);
    return { success: true, user: users[0] };
}

async function deleteUserByUsername(username) {
  const query = "DELETE FROM users WHERE username = ?";
  try {
      await connPool.awaitQuery(query, [username]);
      return { success: true };
  } catch (error) {
      console.error('Error in deleteUserByUsername:', error);
      throw error;
  }
}

async function createPost(username, content) {
  const userQuery = "SELECT id FROM users WHERE username = ?";
  const users = await connPool.awaitQuery(userQuery, [username]);

  if (users.length === 0) {
    throw new Error("User not found");
  }
  username = users[0].id;
  const insertQuery = "INSERT INTO posts (user_id, content) VALUES (?, ?)";
  await connPool.awaitQuery(insertQuery, [username, content]);
}



async function updateLikeCount(postId, increment) {
  const query = increment 
      ? "UPDATE posts SET like_count = like_count + 1 WHERE post_id = ?"
      : "UPDATE posts SET like_count = like_count - 1 WHERE post_id = ?";
  await connPool.query(query, [postId]);
}

async function getLikeCount(postId) {
  const query = "SELECT like_count FROM posts WHERE post_id = ?";
  const result = await connPool.awaitQuery(query, [postId]);
  return result[0]?.like_count || 0;
}

async function getPostCreatorusername(postId) {
  const query = "SELECT user_id FROM posts WHERE post_id = ?";
  const result = await connPool.query(query, [postId]);
  return result[0]?.user_id;
}

async function getUsernameByusername(username) {
  const query = "SELECT username FROM users WHERE id = ?";
  const result = await connPool.query(query, [username]);
  return result[0]?.username;
}

async function checkUserLikedPost(username, postId) {
  // First, retrieve the user ID based on the username
  const userQuery = "SELECT id FROM users WHERE username = ?";
  const users = await connPool.awaitQuery(userQuery, [username]);
  console.log("checking if liked");
  if (users.length === 0) {
      // No user found with the given username
      return false;
  }
  
  const userId = users[0].id;
  console.log(userId);
  // Then, perform the check in post_likes table using userId
  const query = "SELECT COUNT(*) as count FROM post_likes WHERE user_id = ? AND post_id = ?";
  const result = await connPool.awaitQuery(query, [userId, postId]);
  console.log(result);
  // Access the count value correctly
  if (result.length > 0 && result[0]['count'] > 0) {
      return true;
  } else {
      return false;
  }
}


async function addLike(username, postId) {
  const query = "INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)";
  await connPool.query(query, [username, postId]);
}

async function removeLike(username, postId) {
  const query = "DELETE FROM post_likes WHERE user_id = ? AND post_id = ?";
  await connPool.query(query, [username, postId]);
}

async function getPostsByUsername(username) {
  const query = `
      SELECT posts.*, users.username 
      FROM posts 
      INNER JOIN users ON posts.user_id = users.id 
      WHERE users.username = ? 
      ORDER BY posts.created_at DESC
  `;

  try {
      const result = await connPool.awaitQuery(query, [username]);
      return result;
  } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
  }
}

async function deletePost(postId) {
  const query = "DELETE FROM posts WHERE post_id = ?";
  try {
      const result = await connPool.awaitQuery(query, [postId]);
      if (result.affectedRows > 0) {
          return { success: true };
      } else {
          return { success: false };
      }
  } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
  }
}

async function updatePost(postId, content) {
  const query = "UPDATE posts SET content = ? WHERE post_id = ?";
  try {
      await connPool.awaitQuery(query, [content, postId]);
  } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
  }
}

async function getPostById(postId) {
  const query = "SELECT * FROM posts WHERE post_id = ?";
  try {
      const posts = await connPool.awaitQuery(query, [postId]);
      if (posts.length > 0) {
          return posts[0]; // Assuming post_id is unique, there should only be one post
      } else {
          return null; // No post found with the given ID
      }
  } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
  }
}

async function getPostsSortedByLikes(order) {
  const query = `
      SELECT posts.*, users.username, posts.like_count
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      ORDER BY posts.like_count ${order === 'asc' ? 'ASC' : 'DESC'}
  `;
  try {
      const posts = await connPool.awaitQuery(query);
      return posts;
  } catch (error) {
      console.error('Error in getPostsSortedByLikes:', error);
      throw error;
  }
}

async function getLikedPostsByUser(username) {
  const query = `
      SELECT posts.*
      FROM posts
      INNER JOIN post_likes ON posts.post_id = post_likes.post_id
      WHERE post_likes.user_id = ?;
  `;
  console.log(query);
  try {
      const result = await connPool.awaitQuery(query, [username]);
      console.log(result);
      return result;
  } catch (error) {
      console.error('Error in getLikedPostsByUser:', error);
      throw error;
  }
}

async function displayUserNamePost(offset, limit) {
  const postsQuery = `
      SELECT posts.*, users.username, posts.like_count
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
      LIMIT ?, ?
  `;
  try {
      const posts = await connPool.awaitQuery(postsQuery, [offset, limit]);
      return posts;
  } catch (error) {
      console.error('Error in displayUserNamePost:', error);
      throw error;
  }
}

async function countPosts() {
  const query = "SELECT COUNT(*) AS count FROM posts";
  try {
      const result = await connPool.awaitQuery(query);
      return result[0].count;
  } catch (error) {
      console.error('Error in countPosts:', error);
      throw error;
  }
}


module.exports = {
  registerUser,
  CheckUser,
  getUserByUsername,
  deleteUserByUsername,
  createPost,
  getUsernameByusername,
  getLikeCount,
  updateLikeCount,
  getPostCreatorusername,
  checkUserLikedPost,
  addLike,
  removeLike,
  getPostsByUsername,
  deletePost,
  updatePost,
  getPostById,
  getPostsSortedByLikes,
  getLikedPostsByUser,
  displayUserNamePost,
  countPosts,
};
