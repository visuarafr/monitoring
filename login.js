// Initialize Firebase
document.write('<script src="firebase-config.js"></script>');

// Login
document.getElementById('loginBtn').addEventListener('click', function() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            console.error('Error signing in: ', error);
        });
});
