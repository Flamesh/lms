import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDke7HR-LI7Qg8qBwXqYfClH_hHkZuBkLo",
  authDomain: "italiancardclub.firebaseapp.com",
  projectId: "italiancardclub",
  storageBucket: "italiancardclub.firebasestorage.app",
  messagingSenderId: "651480667595",
  appId: "1:651480667595:web:0953f397c372900233124e",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export { googleProvider };