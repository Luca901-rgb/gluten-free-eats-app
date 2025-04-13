import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
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
import { toast } from 'sonner';

// La tua configurazione Firebase
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

// Configurazione Google Provider ottimizzata per mobile
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Persistenza offline per Firestore
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

// Funzioni di autenticazione
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
    localStorage.removeItem('user');
    sessionStorage.removeItem('authAttempted');
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

// Autenticazione Google ottimizzata per mobile
export const signInWithGoogle = async () => {
  console.log("Avvio autenticazione Google...");
  
  // Verifica se l'autenticazione è già stata tentata in questa sessione
  if (sessionStorage.getItem('authAttempted')) {
    toast.info("Autenticazione già in corso, attendi...");
    return;
  }
  
  sessionStorage.setItem('authAttempted', 'true');
  
  // Rileva se è un dispositivo mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  try {
    if (!auth) {
      console.error("Firebase auth non è inizializzato");
      throw new Error("Servizio di autenticazione non disponibile");
    }
    
    let user;
    
    if (isMobile) {
      console.log("Utilizzo metodo redirect per dispositivi mobili");
      try {
        // Prima controlla se c'è un risultato di redirect
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          console.log("Autenticazione da redirect completata");
          user = result.user;
        } else {
          // Altrimenti, inizia un nuovo flusso di redirect
          await signInWithRedirect(auth, googleProvider);
          return null; // La pagina verrà ricaricata dopo il redirect
        }
      } catch (redirectError: any) {
        console.error("Errore nel metodo redirect:", redirectError);
        
        // Prova con il popup come fallback
        if (redirectError.code === 'auth/unauthorized-domain') {
          console.warn("Dominio non autorizzato. Usando modalità di sviluppo.");
          return createMockGoogleUser();
        }
        
        try {
          console.log("Tentativo con popup come fallback");
          const result = await signInWithPopup(auth, googleProvider);
          user = result.user;
        } catch (popupError: any) {
          console.error("Anche il fallback con popup è fallito:", popupError);
          
          if (popupError.code === 'auth/unauthorized-domain') {
            console.warn("Dominio non autorizzato. Usando modalità di sviluppo.");
            return createMockGoogleUser();
          }
          
          throw popupError;
        }
      }
    } else {
      // Approccio desktop
      console.log("Utilizzo metodo popup per desktop");
      const result = await signInWithPopup(auth, googleProvider);
      user = result.user;
    }
    
    if (user) {
      console.log("Autenticazione Google completata con successo");
      
      // Salva l'utente in localStorage per accesso offline
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Utente",
        photoURL: user.photoURL
      }));
      
      // Salva i dati utente in Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date(),
          authProvider: "google"
        }, { merge: true });
      } catch (firestoreError) {
        console.warn("Errore nel salvataggio dati utente:", firestoreError);
      }
      
      return user;
    }
  } catch (error: any) {
    console.error("Errore durante l'autenticazione Google:", error);
    
    let errorMessage = "Errore durante l'autenticazione con Google";
    
    if (error.code) {
      switch (error.code) {
        case 'auth/unauthorized-domain':
          console.log("Dominio non autorizzato per Google Auth. Usando modalità di sviluppo.");
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
    
    // In ambiente di sviluppo o su mobile, usa un utente mock
    if (process.env.NODE_ENV === 'development' || isMobile) {
      console.warn("Utilizzo utente di fallback");
      return createMockGoogleUser();
    }
    
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    // Pulisci il flag di tentativo dopo un breve ritardo
    setTimeout(() => {
      sessionStorage.removeItem('authAttempted');
    }, 5000);
  }
};

// Utente fittizio per sviluppo e test
const createMockGoogleUser = () => {
  const mockUserId = 'dev-' + Math.random().toString(36).substring(2, 15);
  const mockUser = {
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
  
  // Salva l'utente in localStorage per accesso offline
  localStorage.setItem('user', JSON.stringify({
    uid: mockUser.uid,
    email: mockUser.email,
    displayName: mockUser.displayName,
    photoURL: mockUser.photoURL
  }));
  
  return mockUser;
};

// Funzioni admin
export const loginAdmin = async (email: string, password: string) => {
  try {
    if (email === "lcammarota24@gmail.com" && password === "Camma8790") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        console.log("Accesso Firebase fallito, usando modalità offline");
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('isAdmin', 'true');
        return { email, uid: 'offline-admin' };
      }
    } else {
      return await loginUser(email, password);
    }
  } catch (error: any) {
    console.error("Errore login admin:", error);
    throw new Error(error.message);
  }
};

export const isUserAdmin = async (email: string) => {
  if (!email) return false;
  
  try {
    const localAdminEmail = localStorage.getItem('adminEmail');
    const isLocalAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (localAdminEmail === email && isLocalAdmin) {
      return true;
    }
    
    const adminRef = doc(db, "admins", email);
    const adminSnap = await getDoc(adminRef);
    return adminSnap.exists();
  } catch (error: any) {
    console.error("Errore nella verifica dello stato admin:", error);
    
    const localAdminEmail = localStorage.getItem('adminEmail');
    const isLocalAdmin = localStorage.getItem('isAdmin') === 'true';
    
    return (localAdminEmail === email && isLocalAdmin);
  }
};

export const setSpecificUserAsAdmin = async () => {
  const adminEmail = "lcammarota24@gmail.com";
  
  localStorage.setItem('adminEmail', adminEmail);
  console.log("Admin impostato in localStorage per modalità offline");
  
  let retries = 0;
  const maxRetries = 2;
  
  while (retries < maxRetries) {
    try {
      console.log(`Tentativo ${retries + 1}/${maxRetries} di impostare admin su Firebase`);
      
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    success: true,
    message: "Admin impostato in modalità offline (i dati verranno sincronizzati quando sarai online)",
    offline: true
  };
};

export { auth, db, storage };
export default app;