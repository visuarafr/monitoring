import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuration de Firebase
const firebaseConfig = {
 apiKey: "AIzaSyCu5Ss3XxK9xhFxbsTiOUj6GBYJxS5MuiE",
 authDomain: "monitoring-27236.firebaseapp.com",
 projectId: "monitoring-27236",
 storageBucket: "monitoring-27236.appspot.com",
 messagingSenderId: "853833159557",
 appId: "1:853833159557:web:8af061f2d3b5cf9f912aec"
};

// Initialisez Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
