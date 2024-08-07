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

    console.log(`Date: ${dateString} -> Formatted: ${date.toDateString()}`);

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
        const activities = snapshot.docs.map(doc => doc.data());
        console.log('Activities:', activities); // Log des activités pour déboguer
        updateCommercialDashboard(activities);
      });

    const dataForm = document.getElementById('dataForm');
    dataForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const date = document.getElementById('date').value;
      const calls = parseInt(document.getElementById('calls').value);
      const appointments = parseInt(document.getElementById('appointments').value);

      console.log('Submitting data:', { date, calls, appointments, userId });

      try {
        await db.collection('activities').add({
          userId: userId,
          date: date,
          calls: calls,
          appointments: appointments
        });
        console.log('Data submitted successfully');
        dataForm.reset();
      } catch (error) {
        console.error('Erreur lors de l\'ajout des données:', error);
      }
    });
  };

  const showAdminDashboard = () => {
    document.getElementById('admin-dashboard').style.display = 'block';
    db.collection('activities')
      .orderBy('date', 'desc')  // Tri par date en ordre décroissant (du plus récent au plus ancien)
      .onSnapshot(snapshot => {
        const activities = snapshot.docs.map(doc => doc.data());
        console.log('Admin Activities:', activities); // Log des activités pour déboguer
        updateAdminDashboard(activities);
      });
  };

  const updateCommercialDashboard = (activities) => {
    const calls = activities.map(a => a.calls);
    const appointments = activities.map(a => a.appointments);
    const dates = activities.map(a => formatDate(a.date));

    console.log('Formatted Dates:', dates); // Log des dates formatées pour déboguer

    if (callsChart) callsChart.destroy();
    if (appointmentsChart) appointmentsChart.destroy();

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
    const callsByUser = {};
    const appointmentsByUser = {};
    activities.forEach(activity => {
      const user = activity.userId;
      if (!callsByUser[user]) callsByUser[user] = [];
      if (!appointmentsByUser[user]) appointmentsByUser[user] = [];
      callsByUser[user].push(activity.calls);
      appointmentsByUser[user].push(activity.appointments);
    });

    const users = Object.keys(callsByUser);

    if (globalCallsChart) globalCallsChart.destroy();
    if (globalAppointmentsChart) globalAppointmentsChart.destroy();

    globalCallsChart = new Chart(document.getElementById('globalCallsChart'), {
      type: 'line',
      data: {
        labels: users,
        datasets: [{
          label: 'Appels',
          data: users.map(user => callsByUser[user].reduce((a, b) => a + b, 0)),
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
        labels: users,
        datasets: [{
          label: 'Rendez-vous',
          data: users.map(user => appointmentsByUser[user].reduce((a, b) => a + b, 0)),
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
      row.insertCell(0).innerText = activity.userId;
      row.insertCell(1).innerText = formatDate(activity.date);
      row.insertCell(2).innerText = activity.calls;
      row.insertCell(3).innerText = activity.appointments;
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
