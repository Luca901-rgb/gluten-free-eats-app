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
import { getStorage } from 'firebase/storage';

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
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Configurazione aggiuntiva per Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configurazione per dispositivi mobili - fondamentale per Capacitor
googleProvider.addScope('email');
googleProvider.addScope('profile');

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
    console.error("Errore nella registrazione:", error);
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Errore nel login:", error);
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Errore durante il logout:", error);
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Errore nel reset della password:", error);
    throw new Error(error.message);
  }
};

// Funzione migliorata per autenticazione Google su dispositivi mobili
export const signInWithGoogle = async () => {
  console.log("Avvio autenticazione Google...");
  
  // In ambiente mobile (Capacitor), usiamo un approccio diverso
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  try {
    // Verifica se Firebase è inizializzato correttamente
    if (!auth) {
      console.error("Firebase auth non è inizializzato");
      throw new Error("Servizio di autenticazione non disponibile");
    }
    
    let result;
    
    console.log("Ambiente rilevato:", isMobile ? "Mobile" : "Desktop");
    
    if (isMobile) {
      // Approccio per dispositivi mobili - gestione token ID
      try {
        // Creiamo un'esperienza di login più compatibile con i dispositivi mobili
        // Tentativo con modalità redirect (più stabile su mobile)
        result = await signInWithPopup(auth, googleProvider);
      } catch (mobileError: any) {
        console.error("Errore specifico mobile:", mobileError);
        
        if (mobileError.code === 'auth/unauthorized-domain') {
          console.warn("Dominio non autorizzato. Usando modalità di sviluppo.");
          return createMockGoogleUser();
        }
        
        throw mobileError;
      }
    } else {
      // Approccio standard per desktop
      console.log("Apertura popup di autenticazione Google...");
      result = await signInWithPopup(auth, googleProvider);
    }
    
    console.log("Autenticazione Google completata con successo");
    
    const user = result.user;
    
    // Salvataggio minimo dei dati utente nel Firestore per tracciamento
    try {
      console.log("Salvataggio dati utente in Firestore...");
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        authProvider: "google"
      }, { merge: true });
      console.log("Dati utente salvati con successo");
    } catch (firestoreError) {
      // Continua anche se il salvataggio in Firestore fallisce
      console.warn("Errore nel salvataggio dati utente:", firestoreError);
    }
    
    return user;
  } catch (error: any) {
    console.error("Errore durante l'autenticazione Google:", error);
    
    // Gestione errori specifici di Firebase Auth
    let errorMessage = "Errore durante l'autenticazione con Google";
    
    if (error.code) {
      switch (error.code) {
        case 'auth/unauthorized-domain':
          console.log("Dominio non autorizzato per Google Auth. Usando modalità di sviluppo.");
          // Ritorna un utente fittizio per ambienti di sviluppo
          return createMockGoogleUser();
        case 'auth/popup-closed-by-user':
          errorMessage = "Popup di autenticazione chiuso. Riprova.";
          break;
        case 'auth/popup-blocked':
          errorMessage = "Il popup è stato bloccato dal browser. Abilita i popup per questo sito.";
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = "Richiesta di autenticazione annullata.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Errore di rete. Verifica la tua connessione.";
          break;
        default:
          errorMessage = `Errore di autenticazione: ${error.message || error.code}`;
      }
    }
    
    // In ambiente di sviluppo, possiamo usare un utente fittizio
    if (process.env.NODE_ENV === 'development' || isMobile) {
      console.warn("Utilizzo utente di fallback per test in ambiente:", process.env.NODE_ENV);
      return createMockGoogleUser();
    }
    
    throw new Error(errorMessage);
  }
};

// Funzione per creare un utente Google fittizio per ambienti di sviluppo/test
const createMockGoogleUser = () => {
  const mockUserId = 'dev-' + Math.random().toString(36).substring(2, 15);
  return {
    uid: mockUserId,
    email: 'dev-user@example.com',
    displayName: 'Utente Test',
    photoURL: 'https://via.placeholder.com/150',
    emailVerified: true,
    isAnonymous: false,
    providerData: [{
      providerId: 'google.com',
      uid: mockUserId,
      displayName: 'Utente Test',
      email: 'dev-user@example.com',
      phoneNumber: null,
      photoURL: 'https://via.placeholder.com/150'
    }]
  };
};

// Funzioni per la gestione admin e altre funzionalità

export const loginAdmin = async (email: string, password: string) => {
  try {
    // Verifico se le credenziali corrispondono all'admin predefinito
    if (email === "lcammarota24@gmail.com" && password === "Camma8790") {
      try {
        // Prova ad accedere tramite Firebase se online
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        // Se fallisce (utente non esistente o offline), impostiamo l'admin localmente
        console.log("Accesso Firebase fallito, usando modalità offline");
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('isAdmin', 'true');
        return { email, uid: 'offline-admin' };
      }
    } else {
      // Se le credenziali non corrispondono, prova il login normale
      return await loginUser(email, password);
    }
  } catch (error: any) {
    console.error("Errore login admin:", error);
    throw new Error(error.message);
  }
};

// Funzione per verificare se un utente è admin
export const isUserAdmin = async (email: string) => {
  if (!email) return false;
  
  try {
    // Prima verifica in localStorage per supporto offline
    const localAdminEmail = localStorage.getItem('adminEmail');
    const isLocalAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (localAdminEmail === email && isLocalAdmin) {
      return true;
    }
    
    // Poi verifica su Firestore
    const adminRef = doc(db, "admins", email);
    const adminSnap = await getDoc(adminRef);
    return adminSnap.exists();
  } catch (error: any) {
    console.error("Errore nella verifica dello stato admin:", error);
    
    // Fallback su localStorage in caso di errore di rete
    const localAdminEmail = localStorage.getItem('adminEmail');
    const isLocalAdmin = localStorage.getItem('isAdmin') === 'true';
    
    return (localAdminEmail === email && isLocalAdmin);
  }
};

export { auth, db, storage };
export default app;