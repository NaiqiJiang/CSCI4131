const express = require('express');
const app = express();
const pug = require('pug');
const port = 9421;
const data = require('./data.js');
const session = require('express-session');

app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static('public'));
app.set('views', './pugFile');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/resources", express.static("resources"))

app.get('/signup', (req, res) => {
    res.render('signUp.pug');
  });

app.get('/login', (req, res) => {
    try{
    res.render('logInPage.pug');
    }
    catch(e){
        console.log("having error", e);
    }
  });

app.get('/confirmationPage', (req, res) => {
    res.render('confirmationPage');
 });

 app.get('/userProfile', async (req, res) => {
  const username = req.session.username;
  if (!username) {
      return res.redirect('/login');
  }
  try {
      const result = await data.getUserByUsername(username);
      if (result.success) {
          res.render('userProfile', { user: result.user });
      } else {
          res.redirect('/login');
      }
  } catch (error) {
      console.error('Error in userProfile:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/create-post', (req, res) => {
    res.render('createPost');
  });

// direct user into posts page to let them see the post, if they want to like, have to login
app.get(['/', '/posts'], async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    try {
        const posts = await data.displayUserNamePost(offset, pageSize);
        const totalPosts = await data.countPosts();
        const totalPages = Math.ceil(totalPosts / pageSize);

        res.render('postPage', { posts, currentPage: page, totalPages });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

app.get('/user/:username/posts', async (req, res) => {
    try {
        const username = req.params.username;
        let userPosts = await data.getPostsByUsername(username);

        // Calculate if each post can be edited and format the creation time
        const now = new Date();
        userPosts = userPosts.map(post => {
            //three minutes time to count down before cannot edit
            post.canEdit = (now - new Date(post.created_at)) < 3 * 60 * 1000;
            post.formattedCreatedAt = formatDate(post.created_at);
            return post;
        });

        res.render('currentUserPosts', { posts: userPosts, username: username });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).send('Error fetching posts');
    }
});


app.get('/api/check-login', (req, res) => {
    if (req.session.username) {
        res.json({ isLoggedIn: true, username: req.session.username });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.get('/edit-post/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await data.getPostById(postId);
        console.log("postId: ", post);
        if (post) {
            res.render('editPost', { post: post });
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error('Error in /edit-post:', error);
        res.status(500).send('Internal Server Error');
    }
});

//like order base on options
app.get('/posts/sort/:order', async (req, res) => {
    try {
        const order = req.params.order;
        const sortedPosts = await data.getPostsSortedByLikes(order);
        res.render('currentUserPosts', { posts: sortedPosts, username: req.session.username });
    } catch (error) {
        console.error('Error fetching sorted posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/delete-post/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {

        const result = await data.deletePost(postId);

        if (result.success) {
            res.json({ success: true });
        } else {
            res.status(404).send({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error in /delete-post:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/posts/:id/get-likes', async (req, res) => {
    const postId = req.params.id;
    try {
        const likeCount = await data.getLikeCount(postId);
        // console.log(likeCount);
        res.json({ success: true, like_count: likeCount });
    } catch (error) {
        console.error('Error fetching like count:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.get('/liked-posts', async (req, res) => {
    const currentUsername = req.session.username;
    console.log(currentUsername);
    if (!currentUsername) {
        return res.status(401).send('You must be logged in to view liked posts.');
    }

    try {
        const likedPosts = await data.getLikedPostsByUser(currentUsername);
        // console.log(likedPosts);
        res.render('likePostsPage', { posts: likedPosts });
    } catch (error) {
        console.error('Error fetching liked posts:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.post('/register', async (req, res) => {
  try {
      const {
          username,
          email,
          password,
          securityAnswer1,
          securityAnswer2,
          securityAnswer3
      } = req.body;

      if (password !== req.body.confirmPassword) {
          return res.status(400).send('Passwords do not match');
      }

      await data.registerUser(
          username,
          email,
          password,
          securityAnswer1,
          securityAnswer2,
          securityAnswer3
      );
      res.redirect('/confirmationPage');
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send('Error registering user');
  }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await data.CheckUser(username, password);
  
        if (result.success) {
            req.session.username = username;

            res.json({ success: true });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error logging in user' });
    }
  });
  


app.post('/logout', (req, res) => {
  if (req.session) {
      req.session.destroy((err) => {
          if (err) {
              console.error('Logout error:', err);
              res.status(500).send('Error logging out');
          } else {
              res.redirect('/login');
          }
      });
  } else {
      res.redirect('/login');
  }
});

app.post('/delete-account', async (req, res) => {
    const username = req.session.username; 
    console.log(username);
    try {
        const result = await data.deleteUserByUsername(username);
        if (result.success) {
            if (req.session) {
                req.session.destroy();
            }
            res.send({ success: true });
        } else {
            res.status(500).send({ success: false, message: 'Error deleting account' });
        }
    } catch (error) {
        console.error('Error in delete-account route:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});


app.post('/posts', async (req, res) => {
    const content = req.body.content;
    const username = req.session.username; 

    if (!username) {
      return res.status(403).send("You must be logged in to create a post.");
    }

    try {
        await data.createPost(username, content);
        res.redirect('/posts');
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send("An error occurred while creating the post.");
    }
});


// app.post('/posts/:id/like', async (req, res) => {
//     const postId = req.body.postId;
//     const currentUsername = req.session.username;

//     if (!currentUsername) {
//         return res.status(401).send("You must be logged in to like a post.");
//     }

//     try {
//         await data.updateLikeCount(postId, true);
//         const newLikeCount = await data.getLikeCount(postId);
//         console.log(newLikeCount);
//         res.json({ success: true, like_count: newLikeCount });
//     } catch (error) {
//         console.error('Error liking the post:', error);
//         res.status(500).send("An error occurred while liking the post.");
//     }
// });

app.post('/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    const currentUsername = req.session.username;

    if (!currentUsername) {
        return res.status(401).send("You must be logged in to like a post.");
    }

    try {
        // Check if the user has already liked the post
        const userLiked = await data.checkUserLikedPost(currentUsername, postId);

        if (userLiked) {
            // User has already liked the post, so unlike it
            await data.removeLike(currentUsername, postId);
            await data.updateLikeCount(postId, false); // Decrement like count
        } else {
            // User hasn't liked the post, so add a like
            await data.addLike(currentUsername, postId);
            await data.updateLikeCount(postId, true); // Increment like count
        }

        const newLikeCount = await data.getLikeCount(postId);
        res.json({ success: true, like_count: newLikeCount });
    } catch (error) {
        console.error('Error liking the post:', error);
        res.status(500).send("An error occurred while liking the post.");
    }
});


app.delete('/delete-post/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deleteResult = await data.deletePost(postId);
        if (deleteResult.success) {
            res.json({ success: true });
        } else {
            res.status(404).send({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/update-post/:postId', async (req, res) => {
    const postId = req.params.postId;
    console.log(postId);
    const updatedContent = req.body.content;

    try {
        await data.updatePost(postId, updatedContent);

        // Redirect to a confirmation page or back to the list of posts, or handle as needed
        res.redirect('/posts');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.use((req, res) => {
    res.status(404).send("Sorry, can't find that!");
});
  

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});