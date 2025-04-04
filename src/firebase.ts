// frontend/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyOySvhHxwsvJXyidRympUWixUh3z0u7k",
  authDomain: "knightfall-f9d97.firebaseapp.com",
  projectId: "knightfall-f9d97",
  storageBucket: "knightfall-f9d97.firebasestorage.app",
  messagingSenderId: "618244244916",
  appId: "1:618244244916:web:e19ae64eb6460ee3b7dee1",
  measurementId: "G-01W4MG452P",
};

const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);