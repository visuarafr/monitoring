import { auth, db } from './firebase-config.js';

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

// Export des fonctions d'authentification
export { signup, login, logout };
