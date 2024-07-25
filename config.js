import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCu5Ss3XxK9xhFxbsTiOUj6GBYJxS5MuiE",
  authDomain: "monitoring-27236.firebaseapp.com",
  projectId: "monitoring-27236",
  storageBucket: "monitoring-27236.appspot.com",
  messagingSenderId: "853833159557",
  appId: "1:853833159557:web:8af061f2d3b5cf9f912aec"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
