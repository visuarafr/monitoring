// Configuration Firebase
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
var db = firebase.firestore();
