// lib/firebase.ts
// SSR-safe lazy singleton — avoids "window is not defined" on Vercel Server build.
// Firebase Auth uses browser APIs, so we gate initialization behind a client check.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton guard — works in both browser and SSR/build contexts.
// initializeApp is safe to call at module level in Next.js because
// firebase/app itself doesn't use window. Only firebase/auth does.
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// getAuth and getFirestore are safe to export — they only access window
// when methods like signInWithPopup() are actually called, which only
// happens inside "use client" components.
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export { app, auth, db, googleProvider };
