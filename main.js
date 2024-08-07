window.addEventListener('load', () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const role = userDoc.data().role;
          if (role === 'user') {
            showCommercialDashboard(user.uid);
          } else if (role === 'admin') {
            showAdminDashboard();
          } else {
            console.error('Unknown user role');
          }
        } else {
          console.error('No such user document!');
        }
      } catch (error) {
        console.error('Erreur de récupération des données utilisateur:', error);
      }
    } else {
      window.location.href = 'index.html'; // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    }
  });

  let callsChart;
  let appointmentsChart;
  let globalCallsChart;
  let globalAppointmentsChart;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    const dayBeforeYesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else if (date.toDateString() === dayBeforeYesterday.toDateString()) {
      return 'Avant-hier';
    } else {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('fr-FR', options).toUpperCase();
    }
  };

  const showCommercialDashboard = (userId) => {
    document.getElementById('commercial-dashboard').style.display = 'block';
    db.collection('activities')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')  // Tri par date en ordre décroissant (du plus récent au plus ancien)
      .onSnapshot(snapshot => {
        const activities = snapshot.docs.map(doc => doc.data()).reverse(); // Inverser les activités pour les graphiques
        updateCommercialDashboard(activities);
      });

    const dataForm = document.getElementById('dataForm');
    dataForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const date = document.getElementById('date').value;
      const calls = parseInt(document.getElementById('calls').value);
      const appointments = parseInt(document.getElementById('appointments').value);

      try {
        await db.collection('activities').add({
          userId: userId,
          date: date,
          calls: calls,
          appointments: appointments
        });
        dataForm.reset();
      } catch (error) {
        console.error('Erreur lors de l\'ajout des données:', error);
      }
    });
  };

  const showAdminDashboard = async () => {
    document.getElementById('admin-dashboard').style.display = 'block';

    // Récupérer la liste des utilisateurs et remplir le menu déroulant
    const usersSnapshot = await db.collection('users').get();
    const userSelect = document.getElementById('userSelect');

    usersSnapshot.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id;
        option.text = doc.data().name || doc.data().email;
        userSelect.appendChild(option);
    });

    userSelect.addEventListener('change', () => {
        const userId = userSelect.value;
        if (userId === 'all') {
            displayGlobalData(); // Affiche les statistiques globales
        } else {
            displayUserData(userId); // Affiche les statistiques d'un utilisateur spécifique
        }
    });

    displayGlobalData(); // Affiche les statistiques globales par défaut
  };

  const displayGlobalData = () => {
    db.collection('activities').orderBy('date', 'desc').onSnapshot(snapshot => {
        const activities = snapshot.docs.map(doc => doc.data()).reverse();
        updateAdminDashboard(activities);
    });
  };

  const displayUserData = (userId) => {
    db.collection('activities')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .onSnapshot(snapshot => {
            const activities = snapshot.docs.map(doc => doc.data()).reverse();
            updateAdminDashboard(activities);
        });
  };

  const updateCommercialDashboard = (activities) => {
    const calls = activities.map(a => a.calls);
    const appointments = activities.map(a => a.appointments);
    const dates = activities.map(a => formatDate(a.date));

    if (callsChart) callsChart.destroy();
    if (appointmentsChart) callsChart.destroy();

    callsChart = new Chart(document.getElementById('callsChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Appels',
          data: calls,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
          fill: false
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

    appointmentsChart = new Chart(document.getElementById('appointmentsChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Rendez-vous',
          data: appointments,
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1,
          fill: false
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

    const activityTableBody = document.getElementById('activityTable').getElementsByTagName('tbody')[0];
    activityTableBody.innerHTML = '';
    activities.forEach(activity => {
      const row = activityTableBody.insertRow();
      row.insertCell(0).innerText = formatDate(activity.date);
      row.insertCell(1).innerText = activity.calls;
      row.insertCell(2).innerText = activity.appointments;
    });
  };

  const updateAdminDashboard = (activities) => {
    document.getElementById('userData').style.display = 'block';

    const calls = activities.map(a => a.calls);
    const appointments = activities.map(a => a.appointments);
    const dates = activities.map(a => formatDate(a.date));

    if (globalCallsChart) globalCallsChart.destroy();
    if (globalAppointmentsChart) globalAppointmentsChart.destroy();

    globalCallsChart = new Chart(document.getElementById('globalCallsChart'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Appels',
                data: calls,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1,
                fill: false
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

    globalAppointmentsChart = new Chart(document.getElementById('globalAppointmentsChart'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Rendez-vous',
                data: appointments,
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1,
                fill: false
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

    const globalActivityTableBody = document.getElementById('globalActivityTable').getElementsByTagName('tbody')[0];
    globalActivityTableBody.innerHTML = '';
    activities.forEach(activity => {
        const row = globalActivityTableBody.insertRow();
        row.insertCell(0).innerText = formatDate(activity.date);
        row.insertCell(1).innerText = activity.calls;
        row.insertCell(2).innerText = activity.appointments;
    });
  };

  const logoutBtn = document.getElementById('logout-btn');
  const logoutBtnAdmin = document.getElementById('logout-btn-admin');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'index.html'; // Redirige vers la page de connexion après déconnexion
    });
  }

  if (logoutBtnAdmin) {
    logoutBtnAdmin.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'index.html'; // Redirige vers la page de connexion après déconnexion
    });
  }
});
