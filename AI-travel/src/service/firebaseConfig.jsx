// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzxZGXqEqMfzwTuXSXXWarHF-XULGdh0E",
  authDomain: "yz-project-1ba60.firebaseapp.com",
  databaseURL: "https://yz-project-1ba60-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yz-project-1ba60",
  storageBucket: "yz-project-1ba60.appspot.com",
  messagingSenderId: "639129222976",
  appId: "1:639129222976:web:814f3da2bbd3d0ea0c04a5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
