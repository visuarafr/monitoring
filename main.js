window.addEventListener('load', () => {
  // Surveillance de l'état de l'authentification
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const role = userDoc.data().role;
          if (role === 'user') {
            showCommercialDashboard(user.uid);
          } else {
            const adminDoc = await db.collection('admins').doc(user.uid).get();
            if (adminDoc.exists) {
              showAdminDashboard();
            } else {
              console.error('No admin privileges');
            }
          }
        } else {
          console.error('No such user document!');
        }
      } catch (error) {
        console.error('Erreur de récupération des données utilisateur:', error);
      }
    } else {
      window.location.href = 'login.html'; // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    }
  });

  // Affichage du tableau de bord commercial
  const showCommercialDashboard = (userId) => {
    document.getElementById('commercial-dashboard').style.display = 'block';
    db.collection('activities').where('userId', '==', userId).onSnapshot(snapshot => {
      const activities = snapshot.docs.map(doc => doc.data());
      updateCommercialDashboard(activities);
    });
  };

  // Affichage du tableau de bord administrateur
  const showAdminDashboard = () => {
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

  // Déconnexion
  const logoutBtn = document.getElementById('logout-btn');
  const logoutBtnAdmin = document.getElementById('logout-btn-admin');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'login.html'; // Redirige vers la page de connexion après déconnexion
    });
  }

  if (logoutBtnAdmin) {
    logoutBtnAdmin.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = 'login.html'; // Redirige vers la page de connexion après déconnexion
    });
  }
});
