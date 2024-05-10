document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch('/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
            }).then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.getElementById('delete-account-button');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                fetch('/delete-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(response => {
                    if (response.ok) {
                        alert('Account deleted successfully.');
                        window.location.href = '/login';
                    } else {
                        alert('Error deleting account.');
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const recentPostsButton = document.getElementById('recent-posts-button');
    const usernameInput = document.getElementById('username');
    if (recentPostsButton && usernameInput) {
        recentPostsButton.addEventListener('click', () => {
            const username = usernameInput.value;
            window.location.href = `/user/${username}/posts`;
        });
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('like-posts-button').addEventListener('click', () => {
        window.location.href = '/liked-posts';
    });
});
