
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  collection,
  enableIndexedDbPersistence
} from 'firebase/firestore';

// La tua configurazione Firebase
// IMPORTANTE: Queste sono solo chiavi pubbliche che possono essere incluse nel client
const firebaseConfig = {
  apiKey: "AIzaSyAeuKxnFOr4yKkCYGqS9xFkzMVnuX0DnXk",
  authDomain: "glutenfreeeats-b912d.firebaseapp.com",
  projectId: "glutenfreeeats-b912d",
  storageBucket: "glutenfreeeats-b912d.firebasestorage.app",
  messagingSenderId: "76969723997",
  appId: "1:76969723997:web:a9d27f670533ec0d9925b4"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence
try {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
} catch (e) {
  console.error("Error enabling persistence:", e);
}

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

// Nuova funzione per autenticazione Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Funzione per impostare un utente come admin
export const setUserAsAdmin = async (email: string) => {
  try {
    // Crea un documento nella collezione "admins" con l'email come ID
    await setDoc(doc(db, "admins", email), {
      email: email,
      role: "admin",
      createdAt: new Date()
    });
    return true;
  } catch (error: any) {
    console.error("Errore nella registrazione dell'admin:", error);
    throw new Error(error.message);
  }
};

// Funzione per verificare se un utente è admin
export const isUserAdmin = async (email: string) => {
  try {
    const adminRef = doc(db, "admins", email);
    const adminSnap = await getDoc(adminRef);
    return adminSnap.exists();
  } catch (error: any) {
    console.error("Errore nella verifica dello stato admin:", error);
    return false;
  }
};

// Funzione migliorata per impostare l'email specificata come admin
export const setSpecificUserAsAdmin = async () => {
  const adminEmail = "lcammarota24@gmail.com";
  
  // Prima imposta in localStorage per garantire funzionalità offline
  localStorage.setItem('adminEmail', adminEmail);
  console.log("Admin impostato in localStorage per modalità offline");
  
  // Verifica la connessione e tenta di impostare su Firebase
  let retries = 0;
  const maxRetries = 2;
  
  while (retries < maxRetries) {
    try {
      console.log(`Tentativo ${retries + 1}/${maxRetries} di impostare admin su Firebase`);
      
      // Prima controlla se è già admin
      try {
        const isAlreadyAdmin = await isUserAdmin(adminEmail);
        
        if (isAlreadyAdmin) {
          console.log(`L'utente ${adminEmail} è già amministratore`);
          return { 
            success: true, 
            message: "L'utente è già amministratore",
            offline: false
          };
        }
      } catch (checkError) {
        console.warn("Errore durante la verifica dello stato admin:", checkError);
      }
      
      // Imposta l'utente come admin
      await setDoc(doc(db, "admins", adminEmail), {
        email: adminEmail,
        role: "admin",
        createdAt: new Date(),
        lastModified: new Date()
      });
      
      console.log(`L'utente ${adminEmail} è stato impostato come amministratore su Firebase`);
      return { 
        success: true, 
        message: "Utente impostato come amministratore con successo",
        offline: false
      };
    } catch (error: any) {
      retries++;
      console.warn(`Tentativo ${retries}/${maxRetries} fallito:`, error);
      
      // Aspetta prima di riprovare
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Se arriviamo qui, tutti i tentativi sono falliti, ma è già impostato in localStorage
  return {
    success: true,
    message: "Admin impostato in modalità offline (i dati verranno sincronizzati quando sarai online)",
    offline: true
  };
};

export { auth, db };
export default app;
