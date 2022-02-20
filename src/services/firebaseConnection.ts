import firebase from "firebase/app";
import 'firebase/firestore'

let firebaseConfig = {
    apiKey: "AIzaSyBeD-sddA133arS9qFoCBAQDxIGcaLZ_pI",
    authDomain: "tarefaz.firebaseapp.com",
    projectId: "tarefaz",
    storageBucket: "tarefaz.appspot.com",
    messagingSenderId: "679415434300",
    appId: "1:679415434300:web:4cc3e97eca3ed347f40739",
    measurementId: "G-F5KX0D4QZP"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
export default firebase;