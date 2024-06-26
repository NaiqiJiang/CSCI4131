### Social Posting Platform
A web application where users can view, create, like, and sort posts. Implemented with Node.js, Express, and Pug, it features user authentication, post interaction, and real-time updates.

**Features**  
- **User Authentication**: Secure login and signup with bcrypt for password hashing.
- **Post Interaction**: Users can view all posts with like counts. Liking posts requires user authentication.
- **Sorting Posts**: Users can sort posts based on the number of likes (most and least).
- **User Profile Management**:
  - **Create Post**: Users can create new posts.
  - **View Recent Posts**: Displays the user's recent posts with the option to edit (within a 3-minute window) or delete.
  - **Log Out**: Securely logs out the user from the application.
  - **Delete Account**: Permanently deletes the user's account along with all associated posts.
- **Editable Posts**: Allows a brief period post-creation for editing posts. After this period, posts can only be deleted.

**Usage**  
- **Starting the Server**: Run `node server.js` and open http://localhost:9421 in your web browser.
- **Home Page**: View all user posts and sort them by likes.
- **User Authentication**: Sign up for a new account or log in to an existing account (Example credentials: username - aaaa, password - 123).
- **User Profile**: After logging in, users can create posts, view and manage their recent posts, log out, or delete their account.
