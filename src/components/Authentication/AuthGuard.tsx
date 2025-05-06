
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import safeStorage from '@/lib/safeStorage';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedUserTypes = []
}) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log("AuthGuard: Verifica autenticazione...");
        // Verifica se l'utente è autenticato usando safeStorage
        const authStatus = safeStorage.getItem('isAuthenticated');
        const storedUserType = safeStorage.getItem('userType');
        const userId = safeStorage.getItem('userId');
        
        console.log("Auth status:", authStatus);
        console.log("User type:", storedUserType);
        console.log("User ID:", userId);
        
        const isAuth = authStatus === 'true';
        setIsAuthenticated(isAuth);
        setUserType(storedUserType);
        
        // Se l'utente non è autenticato e non c'è stato un tentativo di login
        if (!isAuth && !sessionStorage.getItem('authAttempted')) {
          console.log("Utente non autenticato, reindirizzamento necessario");
        } else {
          console.log("Utente autenticato:", isAuth, "con tipo:", storedUserType);
        }
      } catch (error) {
        console.error("Errore nel controllo autenticazione:", error);
        // Fallback per errori
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Verifica con Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utente autenticato
        setIsAuthenticated(true);
        // Controlla se abbiamo salvato il tipo di utente
        const storedUserType = safeStorage.getItem('userType');
        setUserType(storedUserType);
      } else {
        // Fallback al localStorage per casi offline
        const authStatus = safeStorage.getItem('isAuthenticated');
        const storedUserType = safeStorage.getItem('userType');
        
        if (authStatus === 'true') {
          setIsAuthenticated(true);
          setUserType(storedUserType);
        } else {
          setIsAuthenticated(false);
          setUserType(null);
        }
      }
      setIsLoading(false);
    });
    
    // Cleanup
    return () => unsubscribe();
  }, [location.pathname]);

  // Mentre verifichiamo l'autenticazione, mostriamo un loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-center text-gray-600">Verifica accesso in corso...</p>
      </div>
    );
  }

  // Se l'utente non è autenticato, lo reindirizziamo al login
  if (!isAuthenticated) {
    // Evitiamo toast ripetuti
    if (!sessionStorage.getItem('authRedirectNotified')) {
      toast.error("Accesso richiesto per visualizzare questa pagina");
      sessionStorage.setItem('authRedirectNotified', 'true');
      // Reset dopo 5 secondi
      setTimeout(() => sessionStorage.removeItem('authRedirectNotified'), 5000);
    }
    
    // Determina la pagina di login in base al tipo di utente richiesto
    const loginPath = allowedUserTypes?.includes('restaurant') 
      ? '/restaurant-login'
      : allowedUserTypes?.includes('admin')
      ? '/admin-login'
      : '/login';
    
    console.log(`Reindirizzamento a ${loginPath} - Utente non autenticato`);
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Se è richiesto un tipo specifico di utente, verifica che corrisponda
  if (allowedUserTypes.length > 0 && userType && !allowedUserTypes.includes(userType)) {
    // Se l'utente è autenticato ma con tipo errato, mostriamo un messaggio
    if (!sessionStorage.getItem('userTypeRedirectNotified')) {
      toast.error(`Accesso come ${allowedUserTypes.join(' o ')} richiesto`);
      sessionStorage.setItem('userTypeRedirectNotified', 'true');
      // Reset dopo 5 secondi
      setTimeout(() => sessionStorage.removeItem('userTypeRedirectNotified'), 5000);
    }
    
    // Reindirizzamento alla pagina principale appropriata in base al tipo attuale dell'utente
    let redirectPath = '/';
    if (userType === 'restaurant') {
      redirectPath = '/restaurant-dashboard';
    } else if (userType === 'customer') {
      redirectPath = '/home';
    } else if (userType === 'admin') {
      redirectPath = '/admin-dashboard';
    }
    
    console.log(`Reindirizzamento a ${redirectPath} - Tipo utente non corretto (è ${userType}, richiesto ${allowedUserTypes.join(', ')})`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Se l'utente è autenticato e ha il tipo corretto, mostra il contenuto
  console.log("AuthGuard: Utente autenticato e autorizzato");
  return <>{children}</>;
};

export default AuthGuard;
