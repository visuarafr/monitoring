import { auth, db } from './firebase-config.js';
import { signup, login, logout } from './auth.js';

// Éléments de l'interface
const authContainer = document.getElementById('auth-container');
const commercialDashboard = document.getElementById('commercial-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const logoutBtnAdmin = document.getElementById('logout-btn-admin');

// Événements d'authentification
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

signupBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = prompt('Role (commercial/admin):');
  signup(email, password, role);
});

logoutBtn.addEventListener('click', () => logout());
logoutBtnAdmin.addEventListener('click', () => logout());

// Surveillance de l'état de l'authentification
auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('users').doc(user.uid).get().then(doc => {
      const role = doc.data().role;
      if (role === 'commercial') {
        showCommercialDashboard(user.uid);
      } else if (role === 'admin') {
        showAdminDashboard();
      }
    });
  } else {
    authContainer.style.display = 'block';
    commercialDashboard.style.display = 'none';
    adminDashboard.style.display = 'none';
  }
});

// Affichage du tableau de bord commercial
const showCommercialDashboard = (userId) => {
  authContainer.style.display = 'none';
  commercialDashboard.style.display = 'block';
  db.collection('activities').where('userId', '==', userId).onSnapshot(snapshot => {
    const activities = snapshot.docs.map(doc => doc.data());
    updateCommercialDashboard(activities);
  });
};

// Affichage du tableau de bord administrateur
const showAdminDashboard = () => {
  authContainer.style.display = 'none';
  adminDashboard.style.display = 'block';
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

  const callsChart = new Chart(document.getElementById('callsChart'), {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Appels',
        data: calls
      }]
    }
  });

  const appointmentsChart = new Chart(document.getElementById('appointmentsChart'), {
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

  const globalCallsChart = new Chart(document.getElementById('globalCallsChart'), {
    type: 'bar',
    data: {
      labels: users,
      datasets: [{
        label: 'Appels',
        data: users.map(user => callsByUser[user].reduce((a, b) => a + b, 0))
      }]
    }
  });

  const globalAppointmentsChart = new Chart(document.getElementById('globalAppointmentsChart'), {
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
