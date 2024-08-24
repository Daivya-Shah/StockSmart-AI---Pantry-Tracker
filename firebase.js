// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from 'firebase/firestore';



// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnoAkR0I64PcQA9JwiGN_8YujaBzGyqVs",
  authDomain: "headstarter-project-2-a8f45.firebaseapp.com",
  projectId: "headstarter-project-2-a8f45",
  storageBucket: "headstarter-project-2-a8f45.appspot.com",
  messagingSenderId: "883011563497",
  appId: "1:883011563497:web:976547a1a47948a7126578",
  measurementId: "G-REWJ2BTT6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };