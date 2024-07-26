// Initialize Firebase
document.write('<script src="firebase-config.js"></script>');

document.getElementById('signupBtn').addEventListener('click', function() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
        var user = userCredential.user;
        return db.collection('users').doc(user.uid).set({
            name: name,
            email: email
        });
    }).then(() => {
        window.location.href = "dashboard.html";
    }).catch(error => {
        console.error("Error signing up: ", error);
    });
});
