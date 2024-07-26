window.addEventListener('load', () => {
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
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const logoutBtnAdmin = document.getElementById('logout-btn-admin');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const role = prompt('Role (commercial/admin):');
      signup(email, password, role);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => logout());
  }

  if (logoutBtnAdmin) {
    logoutBtnAdmin.addEventListener('click', () => logout());
  }
});
