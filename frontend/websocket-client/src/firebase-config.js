import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyA7BDTfAgZhpBx_kxUXMNhLUeNp_X1f2ps",
  authDomain: "qhacks2025-dc8e1.firebaseapp.com",
  projectId: "qhacks2025-dc8e1",
  storageBucket: "qhacks2025-dc8e1.firebasestorage.app",
  messagingSenderId: "834745300448",
  appId: "1:834745300448:web:4738e62a42e68c055ae785",
  measurementId: "G-9LK7LRHC01"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export default FIREBASE_APP;