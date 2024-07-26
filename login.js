// Initialize Firebase
document.write('<script src="firebase-config.js"></script>');

document.getElementById('loginBtn').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).then(user => {
        window.location.href = "dashboard.html";
    }).catch(error => {
        console.error("Error signing in: ", error);
    });
});
