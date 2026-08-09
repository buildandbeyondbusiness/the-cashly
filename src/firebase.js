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
  apiKey: "AIzaSyDOwnNc4ZOlcomQkyvc2wRcfk1NICBkhQs",
  authDomain: "cashlyapp-25956.firebaseapp.com",
  projectId: "cashlyapp-25956",
  storageBucket: "cashlyapp-25956.firebasestorage.app",
  messagingSenderId: "591724211566",
  appId: "1:591724211566:web:cec1db7bfaf452cc5d257f"
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  }
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
