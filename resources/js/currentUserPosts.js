//use for editing and delete button in posts
document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.button-edit');
    const deleteButtons = document.querySelectorAll('.button-delete');
  
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const postId = button.dataset.postId;
        window.location.href = `/edit-post/${postId}`;
      });
    });
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const postId = button.dataset.postId;
        deletePost(postId);
      });
    });
  });
  
  function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
      fetch(`/delete-post/${postId}`, { method: 'DELETE' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            window.location.reload();
          } else {
            alert('There was an error deleting the post.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while deleting the post.');
        });
    }
  }
  

  //the eventlistener for sort by most like and least like
  document.addEventListener('DOMContentLoaded', () => {

    const sortMostLikes = document.querySelector('[data-sort-type="mostLikes"]');
    const sortLeastLikes = document.querySelector('[data-sort-type="leastLikes"]');
    const postsContainer = document.querySelector('.posts-container');

    sortMostLikes.addEventListener('click', () => sortPosts('desc'));
    sortLeastLikes.addEventListener('click', () => sortPosts('asc'));

    function sortPosts(order) {
        let posts = Array.from(postsContainer.getElementsByClassName('post'));
        posts.sort((a, b) => {
            const likesA = parseInt(a.querySelector('.like-count').textContent.split(' ')[0], 10);
            const likesB = parseInt(b.querySelector('.like-count').textContent.split(' ')[0], 10);

            return order === 'asc' ? likesA - likesB : likesB - likesA;
        });

        // Clear out the current posts
        postsContainer.innerHTML = '';

        // Append the sorted posts
        posts.forEach(post => postsContainer.appendChild(post));
    }
});
