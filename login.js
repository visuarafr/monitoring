// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCu5Ss3XxK9xhFxbsTiOUj6GBYJxS5MuiE",
    authDomain: "monitoring-27236.firebaseapp.com",
    projectId: "monitoring-27236",
    storageBucket: "monitoring-27236.appspot.com",
    messagingSenderId: "853833159557",
    appId: "1:853833159557:web:8af061f2d3b5cf9f912aec"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();

document.getElementById('loginBtn').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).then(user => {
        window.location.href = "dashboard.html";
    }).catch(error => {
        console.error("Error signing in: ", error);
    });
});
