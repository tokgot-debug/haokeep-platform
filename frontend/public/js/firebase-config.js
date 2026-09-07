/**
 * Firebase App & SDK Integration Module for Vanbransa CleanPulse
 * Project: vanbransa-housekeeping-pro
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
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
  apiKey: "AIzaSyCHWgZ3VUa9_SscbRvw4Fa6AlKU44NTWd8",
  authDomain: "vanbransa-housekeeping-pro.firebaseapp.com",
  projectId: "vanbransa-housekeeping-pro",
  storageBucket: "vanbransa-housekeeping-pro.firebasestorage.app",
  messagingSenderId: "505255380907",
  appId: "1:505255380907:web:aed893af94dfbb52aa74ee",
  measurementId: "G-L9G7V14G6T"
};

// Initialize Firebase App & Analytics
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch(e) {
    console.warn("Analytics skipped or blocked in current environment:", e);
}

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
    analytics,
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
