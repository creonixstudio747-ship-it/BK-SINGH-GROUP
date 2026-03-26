// lib/firebase.ts
// SSR-safe Firebase singleton for Next.js App Router.
// IMPORTANT: getAuth() validates the API key immediately when called.
// Calling it at module level causes Vercel's SSR prerender to crash with
// auth/invalid-api-key because the module is evaluated on the server.
// We guard getAuth() and getFirestore() behind typeof window so they only
// run in the browser, never during the server-side static generation phase.

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

// initializeApp is safe at module level — it only stores config, never validates the API key.
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// getAuth() and getFirestore() are guarded: they are only instantiated in the browser.
// During SSR/prerender these resolve to null, but all callers (useEffect, event handlers)
// only execute client-side so the null is never accessed.
const auth = (typeof window !== "undefined" ? getAuth(app) : null) as Auth;
const db = (typeof window !== "undefined" ? getFirestore(app) : null) as Firestore;

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export { app, auth, db, googleProvider };
