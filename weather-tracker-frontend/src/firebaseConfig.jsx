// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDUeU6UWILTK2ElTJjCLnEQDes__4edXoc",
    authDomain: "weather-app-group4.firebaseapp.com",
    projectId: "weather-app-group4",
    storageBucket: "weather-app-group4.firebasestorage.app",
    messagingSenderId: "1043402696032",
    appId: "1:1043402696032:web:f9e1b5b79ce3cc88fd6a05"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app