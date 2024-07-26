auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadAllUserData();
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch(error => {
        console.error('Error signing out: ', error);
    });
});

function loadAllUserData() {
    var query = db.collection('salesData');

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
