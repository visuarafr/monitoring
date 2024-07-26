window.addEventListener('load', () => {
  // Création de compte utilisateur
  const signup = async (name, email, password) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await db.collection('users').doc(user.uid).set({
        name: name,
        email: user.email,
        role: 'user'
      });
      window.location.href = 'login.html'; // Redirige vers la page de connexion après inscription
    } catch (error) {
      console.error('Erreur de création de compte:', error);
    }
  };

  // Connexion utilisateur
  const login = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = 'dashboard.html'; // Redirige vers la page de tableau de bord après connexion
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  // Gestion des événements sur la page de connexion
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  // Gestion des événements sur la page d'inscription
  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      signup(name, email, password);
    });
  }
});
