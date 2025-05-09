
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import safeStorage from '@/lib/safeStorage';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  userType: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User ${currentUser.uid} logged in` : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        // Se l'utente è autenticato con Firebase, impostiamo isAuthenticated e salviamo i dati
        setIsAuthenticated(true);
        safeStorage.setItem('isAuthenticated', 'true');
        safeStorage.setItem('userId', currentUser.uid);
        
        // Otteniamo il tipo di utente dal localStorage se non è già presente
        const storedUserType = safeStorage.getItem('userType');
        setUserType(storedUserType);
        console.log("User type from storage:", storedUserType);
      } else {
        // Se non c'è un utente autenticato, controlliamo il localStorage per le sessioni offline
        const authStatus = safeStorage.getItem('isAuthenticated');
        const storedUserType = safeStorage.getItem('userType');
        
        if (authStatus === 'true') {
          setIsAuthenticated(true);
          setUserType(storedUserType);
          console.log("Using offline authentication data");
        } else {
          setIsAuthenticated(false);
          setUserType(null);
          console.log("No authentication found");
        }
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      console.log("Logging out");
      await signOut(auth);
      
      // Pulizia dei dati di autenticazione in safeStorage
      safeStorage.removeItem('isAuthenticated');
      safeStorage.removeItem('userType');
      safeStorage.removeItem('userId');
      safeStorage.removeItem('userEmail');
      safeStorage.removeItem('isRestaurantOwner');
      safeStorage.removeItem('isCustomer');
      
      // Aggiorniamo lo stato
      setIsAuthenticated(false);
      setUserType(null);
      setUser(null);
      
      toast.success("Logout effettuato con successo");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Errore durante il logout");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isLoading, 
      setIsLoading, 
      isAuthenticated, 
      userType,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
