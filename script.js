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
var db = firebase.firestore();
var auth = firebase.auth();

document.getElementById('loginBtn').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password).then(user => {
        showDataSection();
    }).catch(error => {
        console.error("Error signing in: ", error);
    });
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut().then(() => {
        showLoginSection();
    }).catch(error => {
        console.error("Error signing out: ", error);
    });
});

auth.onAuthStateChanged(user => {
    if (user) {
        showDataSection();
    } else {
        showLoginSection();
    }
});

function showDataSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('data-section').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
    loadUserData();
}

function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('data-section').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
}

document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var calls = document.getElementById('calls').value;
    var appointments = document.getElementById('appointments').value;
    var user = auth.currentUser;

    db.collection('salesData').add({
        salesperson: user.email,
        calls: calls,
        appointments: appointments,
        date: new Date()
    }).then(() => {
        loadUserData();
    }).catch(error => {
        console.error("Error adding document: ", error);
    });
});

function loadUserData() {
    var user = auth.currentUser;
    var query = db.collection('salesData').where('salesperson', '==', user.email);

    if (user.email === 'admin@example.com') {
        query = db.collection('salesData');
    }

    query.get().then(querySnapshot => {
        var dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        dataTable.innerHTML = '';

        querySnapshot.forEach(doc => {
            var data = doc.data();
            var row = dataTable.insertRow();
            row.insertCell(0).innerText = data.salesperson;
            row.insertCell(1).innerText = data.calls;
            row.insertCell(2).innerText = data.appointments;
            row.insertCell(3).innerText = data.date.toDate().toDateString();
        });
    }).catch(error => {
        console.error("Error getting documents: ", error);
    });
}
