import * as firebase from 'firebase'
require ('@firebase/firestore')
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAYYGZk8CNvi2uzeX8Mo0fNfzhAgRSWP_I",
    authDomain: "barter-3f300.firebaseapp.com",
    projectId: "barter-3f300",
    storageBucket: "barter-3f300.appspot.com",
    messagingSenderId: "471293303143",
    appId: "1:471293303143:web:cb7093d9f1501d158337c2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()