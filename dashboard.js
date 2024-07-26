auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        if (adminEmails.includes(user.email)) {
            window.location.href = 'admin-dashboard.html';
        } else {
            loadUserData();
        }
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch(error => {
        console.error('Error signing out: ', error);
    });
});

document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var calls = document.getElementById('calls').value;
    var appointments = document.getElementById('appointments').value;
    var user = auth.currentUser;

    db.collection('salesData').add({
        salespersonId: user.uid,
        salesperson: user.email,
        calls: calls,
        appointments: appointments,
        date: new Date()
    }).then(() => {
        loadUserData();
    }).catch(error => {
        console.error('Error adding document: ', error);
    });
});

function loadUserData() {
    var user = auth.currentUser;
    var query = db.collection('salesData').where('salespersonId', '==', user.uid);

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
        console.error('Error getting documents: ', error);
    });
}
