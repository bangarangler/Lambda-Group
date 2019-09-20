import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore";
import "firebase/database"
import "firebase/storage"

// var firebaseConfig = {
//     apiKey: "AIzaSyB1hY9BPU0J0JOmFb-grXOm9LYD2ON4t1I",
//     authDomain: "lambda-group-organizer.firebaseapp.com",
//     databaseURL: "https://lambda-group-organizer.firebaseio.com",
//     projectId: "lambda-group-organizer",
//     storageBucket: "",
//     messagingSenderId: "303661905563",
//     appId: "1:303661905563:web:13e7cea7e52d0b4d"
// };

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();
