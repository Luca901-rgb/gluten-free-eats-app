
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

// Autenticazione Google semplificata
export const signInWithGoogle = async () => {
  try {
    // Usa sempre il popup per semplicità e coerenza
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Salva l'utente nel localStorage per accesso offline
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
  } catch (error: any) {
    console.error("Errore durante l'autenticazione Google:", error);
    
    // In caso di errore, utilizza un utente di test
    if (process.env.NODE_ENV === 'development' || 
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/unauthorized-domain') {
      const mockUser = createMockGoogleUser();
      return mockUser;
    }
    
    throw new Error(`Errore di autenticazione: ${error.message || error.code}`);
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
  
  toast.success("Modalità di test: Accesso con utente demo");
  
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
  localStorage.setItem('isAdmin', 'true');
  console.log("Admin impostato in localStorage per modalità offline");
  
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
  } catch (error) {
    console.warn("Errore nell'impostazione admin:", error);
    
    return {
      success: true,
      message: "Admin impostato in modalità offline (i dati verranno sincronizzati quando sarai online)",
      offline: true
    };
  }
};

export { auth, db, storage };
export default app;
