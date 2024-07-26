// Inclure firebase-config.js avant d'exécuter ce script

// Toggle between login and signup forms
document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('auth-section').classList.add('show-signup');
});

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('auth-section').classList.remove('show-signup');
});

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

// Sign Up
document.getElementById('signupBtn').addEventListener('click', function() {
    var name = document.getElementById('signup-name').value;
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            var user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                name: name,
                email: email
            });
        })
        .then(() => {
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            console.error('Error signing up: ', error);
        });
});
