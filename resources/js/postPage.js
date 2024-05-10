function toggleLike(button) {
    const postId = button.getAttribute('data-id');
    fetch(`/posts/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId }),
        credentials: 'include',
    })
    .then(response => {
        if (response.status === 401) {
            alert('You must be logged in to like a post.');
            throw new Error('Login required');
        }
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        const postActionsContainer = button.closest('.post-actions');
        const likeCountElement = postActionsContainer.querySelector('.like-count');
        likeCountElement.textContent = `${data.like_count} likes`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function handleUserAction() {
    const actionButton = document.querySelector('.login-button');
    fetch('/api/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.isLoggedIn) {
                actionButton.textContent = data.username;
                actionButton.addEventListener('click', () => {
                    window.location.href = '/userprofile'; // Redirect to the user profile page
                });
            } else {
                actionButton.textContent = 'Login';
                actionButton.addEventListener('click', () => {
                    window.location.href = '/login'; // Redirect to the login page
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    handleUserAction();
});


document.addEventListener('DOMContentLoaded', () => {
    const sortMostLikesBtn = document.getElementById('sort-most-likes');
    const sortLeastLikesBtn = document.getElementById('sort-least-likes');

    sortMostLikesBtn.addEventListener('click', function() {
        sortPosts('desc');
    });

    sortLeastLikesBtn.addEventListener('click', function() {
        sortPosts('asc');
    });

    function sortPosts(order) {
        const postsContainer = document.querySelector('.posts-container');

        let postsArray = Array.from(postsContainer.getElementsByClassName('post'));

        postsArray.sort(function(a, b) {
            const likesA = parseInt(a.querySelector('.like-count').textContent.split(' ')[0], 10);
            const likesB = parseInt(b.querySelector('.like-count').textContent.split(' ')[0], 10);

            if (order === 'asc') {
                return likesA - likesB; // For ascending order
            } else {
                return likesB - likesA; // For descending order
            }
        });

        postsContainer.innerHTML = '';

        postsArray.forEach(function(post) {
            postsContainer.appendChild(post);
        });
    }
});

