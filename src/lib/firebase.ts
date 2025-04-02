import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';

// La tua configurazione Firebase
// IMPORTANTE: Queste sono solo chiavi pubbliche che possono essere incluse nel client
const firebaseConfig = {
  apiKey: "INSERISCI_QUI_LA_TUA_API_KEY",
  authDomain: "INSERISCI_QUI_IL_TUO_AUTH_DOMAIN",
  projectId: "INSERISCI_QUI_IL_TUO_PROJECT_ID",
  storageBucket: "INSERISCI_QUI_IL_TUO_STORAGE_BUCKET",
  messagingSenderId: "INSERISCI_QUI_IL_TUO_MESSAGING_SENDER_ID",
  appId: "INSERISCI_QUI_IL_TUO_APP_ID"
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
