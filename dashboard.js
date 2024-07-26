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

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        loadUserData();
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    }).catch(error => {
        console.error("Error signing out: ", error);
    });
});

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

    if (user.email === 'admin@example.com') { // Remplacez avec l'email de l'admin
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
            row.insertCell(3).innerText = new Date(data.date.seconds * 1000).toLocaleDateString();
        });
    }).catch(error => {
        console.error("Error getting documents: ", error);
    });
}
