// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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