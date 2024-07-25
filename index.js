// Example: Display a simple message
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.innerHTML = '<h1>Welcome to the JavaScript App</h1>';
  }
});

// Add your other JavaScript logic here
// For example, you can import and use your other JS files

// AdminDashboard
import './AdminDashboard.js';
// Dashboard
import './Dashboard.js';
// Login
import './Login.js';
// Register
import './Register.js';
// UserDashboard
import './UserDashboard.js';
// Firebase configuration
import './firebase.js';
