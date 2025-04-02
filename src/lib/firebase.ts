
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';

// La tua configurazione Firebase
// IMPORTANTE: Queste sono solo chiavi pubbliche che possono essere incluse nel client
const firebaseConfig = {
  apiKey: "il-tuo-api-key", // Copia qui il tuo apiKey
  authDomain: "il-tuo-project-id.firebaseapp.com", // Copia qui il tuo authDomain
  projectId: "il-tuo-project-id", // Copia qui il tuo projectId
  storageBucket: "il-tuo-project-id.appspot.com", // Copia qui il tuo storageBucket
  messagingSenderId: "il-tuo-messaging-sender-id", // Copia qui il tuo messagingSenderId
  appId: "il-tuo-app-id" // Copia qui il tuo appId
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funzioni helper per l'autenticazione
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { auth };
export default app;
