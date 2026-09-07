/**
 * Firebase App & SDK Integration Module for Vanbransa CleanPulse
 * Project: vanbransaopshub
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc, 
    addDoc, 
    onSnapshot, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  projectId: "vanbransaopshub",
  appId: "1:25599705055:web:2c571a39b0d86b81f34e6a",
  storageBucket: "vanbransaopshub.firebasestorage.app",
  apiKey: "AIzaSyBgeKoV9dY3XMSl9GcAAd5s7pEZdxaCxvk",
  authDomain: "vanbransaopshub.firebaseapp.com",
  messagingSenderId: "25599705055",
  measurementId: "G-65Z0FL5KTG"
};

// Initialize Firebase SDKs
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = null;

try {
    db = getFirestore(app);
} catch(e) {
    console.warn("Firestore initialized in offline fallback mode:", e);
}

// Export to Global Window Scope for Vanbransa Operations App
window.CleanPulseFirebase = {
    app,
    auth,
    db,
    methods: {
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        signInAnonymously,
        collection,
        doc,
        getDoc,
        getDocs,
        setDoc,
        updateDoc,
        addDoc,
        onSnapshot,
        query,
        where
    }
};

console.log("🔥 Vanbransa CleanPulse Firebase SDK Initialized for Project:", firebaseConfig.projectId);
