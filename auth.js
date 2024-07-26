// Création de compte
const signup = async (email, password, role) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      role: role
    });
  } catch (error) {
    console.error('Erreur de création de compte:', error);
  }
};

// Connexion
const login = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};

// Déconnexion
const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
};

// Événements d'authentification
document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

document.getElementById('signup-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = prompt('Role (commercial/admin):');
  signup(email, password, role);
});

document.getElementById('logout-btn').addEventListener('click', () => logout());
document.getElementById('logout-btn-admin').addEventListener('click', () => logout());
