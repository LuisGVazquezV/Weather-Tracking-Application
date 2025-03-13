import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK102JFR29-wlGxn1Tv0YwkuWt9btmugk",
  authDomain: "react-project-6377c.firebaseapp.com",
  projectId: "react-project-6377c",
  storageBucket: "react-project-6377c.firebasestorage.app",
  messagingSenderId: "20230706422",
  appId: "1:20230706422:web:58a00d339c89183a0208d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app