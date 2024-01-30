// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVass5fIuMtZFP7vvDvMrFCtYuD3Lnojw",
  authDomain: "time-frame-4deee.firebaseapp.com",
  projectId: "time-frame-4deee",
  storageBucket: "time-frame-4deee.appspot.com",
  messagingSenderId: "281812515094",
  appId: "1:281812515094:web:1d466606b1abbe4b533837",
  measurementId: "G-GH4FWNH29Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function capitalizeWords(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

function removeNonLetters(str) {
  return str.replace(/[^a-zA-Z\s]/g, "");
}

export function handleErrorMessage(error){
  const substring = error.substring(error.lastIndexOf("/") + 1);
  const result = substring.replace(/-/g, " ");
  return removeNonLetters(capitalizeWords(result));
}