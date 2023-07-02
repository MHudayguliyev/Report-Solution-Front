import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAr1rfIcGfxmjiweIfDEgHwToKwBTjGO1I",
  authDomain: "reportsolution-81c9e.firebaseapp.com",
  projectId: "reportsolution-81c9e",
  storageBucket: "reportsolution-81c9e.appspot.com",
  messagingSenderId: "63772407603",
  appId: "1:63772407603:web:52c60564262aa20007f046"
};

firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();
export { auth, firebase };