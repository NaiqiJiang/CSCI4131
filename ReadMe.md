Description of the project


-------
For my project, first I'll have to run node server.js to start the terminal, then it will run the port that I'm using. After opening the link, it will direct to a page that contains all the posts with like and like count, and if you want to like the posts, you must sign in, which it will pop out a window that tells you to log in first. Also there's two button that says sort by most like and least like, which allows the user to see what's been liked the most and least. After that, when you click login page, there's login and signup, which's same as all other websites, and I did use bcrypt to hash the password. And for the users that I've right now is username: aaaa , Password: 123. After you login, you'll be direct to a userProfile page, which contains the button "post", "createPost", "Recent Posts", "Log out", and "delete Account". The post button is use to direct to the overall posts page. and create Post is used to making posts and it will redirect to overall posts after you posts it. And if you want to update it, you will have to goes to profile page by clicking upper right button that shows the username, then click Recent Post button, then it will show you the posts that you've post with its like count. And then there's a three minute time to edit the posts that you've just post. After that, you can only delete it, no longer updating it, also you can sort it in recent posts page to see which of your post is been liked the most and least. And if you want to go back to userProfile page, just click posts and then username. And Log out button will just simply log out the account and allowed you to enter a different account or signup and account. And delete account button will just simply let you delete the account and then it will delete all the posts that's been post by that users.


-------
Social Posting Platform
A web application where users can view, create, like, and sort posts. Implemented with Node.js, Express, and Pug, it features user authentication, post interaction, and real-time updates.

Features
User Authentication: Secure login and signup with bcrypt for password hashing.
Post Interaction: Users can view all posts with like counts. Liking posts requires user authentication.
Sorting Posts: Users can sort posts based on the number of likes (most and least).
User Profile Management:
Create Post: Users can create new posts.
View Recent Posts: Displays the user's recent posts with the option to edit (within a 3-minute window) or delete.
Log Out: Securely logs out the user from the application.
Delete Account: Permanently deletes the user's account along with all associated posts.
Editable Posts: Allows a brief period post-creation for editing posts. After this period, posts can only be deleted.

Usage
Starting the Server: Run node server.js and open http://localhost:9421 in your web browser.
Home Page: View all user posts and sort them by likes.
User Authentication: Sign up for a new account or log in to an existing account (Example credentials: username - aaaa, password - 123).
User Profile: After logging in, users can create posts, view and manage their recent posts, log out, or delete their account.#   C S C I 4 1 3 1 
 
 