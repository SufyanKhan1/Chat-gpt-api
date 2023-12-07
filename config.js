const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyBZDkdxKlv8CjYrSZEimEd934uqNMSYI6g",
  authDomain: "authentication-app-90fe8.firebaseapp.com",
  projectId: "authentication-app-90fe8",
  storageBucket: "authentication-app-90fe8.appspot.com",
  messagingSenderId: "915990052590",
  appId: "1:915990052590:web:fe47f5c89db5dede897dff",
  measurementId: "G-H97N8B337S",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("chatgpt");
module.exports = User;
