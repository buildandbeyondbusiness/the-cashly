import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOdaclQWTACcL3A2RRmzJBPbShMY9ozmw",
  authDomain: "cashly-personal.firebaseapp.com",
  projectId: "cashly-personal",
  storageBucket: "cashly-personal.firebasestorage.app",
  messagingSenderId: "326691281601",
  appId: "1:326691281601:web:4eb26737550aac7ac7d240"
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase safely bypassed due to init exception:", e);
}

export { 
  app, 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
};
