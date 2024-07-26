window.addEventListener('load', () => {
  // Surveillance de l'état de l'authentification
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          const role = doc.data().role;
          if (role === 'commercial') {
            showCommercialDashboard(user.uid);
          } else if (role === 'admin') {
            showAdminDashboard();
          }
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Erreur de récupération des données utilisateur:', error);
      }
    } else {
      document.getElementById('auth-container').style.display = 'block';
      document.getElementById('commercial-dashboard').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'none';
    }
  });

  // Affichage du tableau de bord commercial
  const showCommercialDashboard = (userId) => {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('commercial-dashboard').style.display = 'block';
    db.collection('activities').where('userId', '==', userId).onSnapshot(snapshot => {
      const activities = snapshot.docs.map(doc => doc.data());
      updateCommercialDashboard(activities);
    });
  };

  // Affichage du tableau de bord administrateur
  const showAdminDashboard = () => {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    db.collection('activities').onSnapshot(snapshot => {
      const activities = snapshot.docs.map(doc => doc.data());
      updateAdminDashboard(activities);
    });
  };

  // Mise à jour du tableau de bord commercial
  const updateCommercialDashboard = (activities) => {
    const calls = activities.map(a => a.calls);
    const appointments = activities.map(a => a.appointments);
    const dates = activities.map(a => a.date);

    new Chart(document.getElementById('callsChart'), {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Appels',
          data: calls
        }]
      }
    });

    new Chart(document.getElementById('appointmentsChart'), {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Rendez-vous',
          data: appointments
        }]
      }
    });

    const activityTableBody = document.getElementById('activityTable').getElementsByTagName('tbody')[0];
    activityTableBody.innerHTML = '';
    activities.forEach(activity => {
      const row = activityTableBody.insertRow();
      row.insertCell(0).innerText = activity.date;
      row.insertCell(1).innerText = activity.calls;
      row.insertCell(2).innerText = activity.appointments;
    });
  };

  // Mise à jour du tableau de bord administrateur
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

    new Chart(document.getElementById('globalCallsChart'), {
      type: 'bar',
      data: {
        labels: users,
        datasets: [{
          label: 'Appels',
          data: users.map(user => callsByUser[user].reduce((a, b) => a + b, 0))
        }]
      }
    });

    new Chart(document.getElementById('globalAppointmentsChart'), {
      type: 'bar',
      data: {
        labels: users,
        datasets: [{
          label: 'Rendez-vous',
          data: users.map(user => appointmentsByUser[user].reduce((a, b) => a + b, 0))
        }]
      }
    });

    const globalActivityTableBody = document.getElementById('globalActivityTable').getElementsByTagName('tbody')[0];
    globalActivityTableBody.innerHTML = '';
    activities.forEach(activity => {
      const row = globalActivityTableBody.insertRow();
      row.insertCell(0).innerText = activity.userId;
      row.insertCell(1).innerText = activity.date;
      row.insertCell(2).innerText = activity.calls;
      row.insertCell(3).innerText = activity.appointments;
    });
  };
}); // Fin de window.addEventListener
