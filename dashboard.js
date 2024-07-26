// Variables pour les graphiques
let callsChart;
let appointmentsChart;
let comparativeChart;

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                var role = doc.data().role;
                if (adminEmails.includes(user.email)) {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    loadUserData();
                    initializeCharts();
                }
            }
        }).catch(error => {
            console.error('Error checking user role: ', error);
        });
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
        updateCharts();
    }).catch(error => {
        console.error('Error adding document: ', error);
    });
});

document.getElementById('apply-filters').addEventListener('click', function() {
    loadUserData();
    updateCharts();
});

function loadUserData() {
    var user = auth.currentUser;
    var startDate = new Date(document.getElementById('start-date').value);
    var endDate = new Date(document.getElementById('end-date').value);
    var query = db.collection('salesData').where('salespersonId', '==', user.uid);

    if (!isNaN(startDate) && !isNaN(endDate)) {
        query = query.where('date', '>=', startDate).where('date', '<=', endDate);
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
        console.error('Error getting documents: ', error);
    });
}

function initializeCharts() {
    const ctxCalls = document.getElementById('callsChart').getContext('2d');
    const ctxAppointments = document.getElementById('appointmentsChart').getContext('2d');
    const ctxComparative = document.getElementById('comparativeChart').getContext('2d');

    callsChart = new Chart(ctxCalls, {
        type: 'bar',
        data: {
            labels: [], // Les dates ou les périodes
            datasets: [{
                label: 'Nombre d\'appels',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    appointmentsChart = new Chart(ctxAppointments, {
        type: 'bar',
        data: {
            labels: [], // Les dates ou les périodes
            datasets: [{
                label: 'Nombre de RDV',
                data: [],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    comparativeChart = new Chart(ctxComparative, {
        type: 'bar',
        data: {
            labels: [], // Les commerciaux
            datasets: [{
                label: 'Nombre d\'appels',
                data: [],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            },
            {
                label: 'Nombre de RDV',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    updateCharts();
}

function updateCharts() {
    var user = auth.currentUser;
    var startDate = new Date(document.getElementById('start-date').value);
    var endDate = new Date(document.getElementById('end-date').value);
    var query = db.collection('salesData').where('salespersonId', '==', user.uid);

    if (!isNaN(startDate) && !isNaN(endDate)) {
        query = query.where('date', '>=', startDate).where('date', '<=', endDate);
    }

    query.get().then(querySnapshot => {
        var callsData = [];
        var appointmentsData = [];
        var labels = [];

        querySnapshot.forEach(doc => {
            var data = doc.data();
            labels.push(new Date(data.date.seconds * 1000).toLocaleDateString());
            callsData.push(data.calls);
            appointmentsData.push(data.appointments);
        });

        callsChart.data.labels = labels;
        callsChart.data.datasets[0].data = callsData;
        callsChart.update();

        appointmentsChart.data.labels = labels;
        appointmentsChart.data.datasets[0].data = appointmentsData;
        appointmentsChart.update();
    }).catch(error => {
        console.error('Error getting documents: ', error);
    });

    // Mettre à jour le graphique comparatif
    db.collection('salesData').get().then(querySnapshot => {
        var comparativeLabels = [];
        var comparativeCallsData = [];
        var comparativeAppointmentsData = [];

        querySnapshot.forEach(doc => {
            var data = doc.data();
            if (!comparativeLabels.includes(data.salesperson)) {
                comparativeLabels.push(data.salesperson);
                comparativeCallsData.push(data.calls);
                comparativeAppointmentsData.push(data.appointments);
            } else {
                var index = comparativeLabels.indexOf(data.salesperson);
                comparativeCallsData[index] += data.calls;
                comparativeAppointmentsData[index] += data.appointments;
            }
        });

        comparativeChart.data.labels = comparativeLabels;
        comparativeChart.data.datasets[0].data = comparativeCallsData;
        comparativeChart.data.datasets[1].data = comparativeAppointmentsData;
        comparativeChart.update();
    }).catch(error => {
        console.error('Error getting documents: ', error);
    });
}
