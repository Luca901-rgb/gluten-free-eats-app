
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import safeStorage from '@/lib/safeStorage';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredUserType?: 'customer' | 'restaurant' | 'admin';
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredUserType = 'restaurant'
}) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    // Aggiungiamo un timeout breve per garantire che localStorage sia pronto
    setTimeout(() => {
      try {
        // Verifica se l'utente è autenticato usando safeStorage
        const authStatus = safeStorage.getItem('isAuthenticated');
        const storedUserType = safeStorage.getItem('userType');
        
        console.log("Auth status:", authStatus);
        console.log("User type:", storedUserType);
        
        setIsAuthenticated(authStatus === 'true');
        setUserType(storedUserType);
      } catch (error) {
        console.error("Errore nel controllo autenticazione:", error);
        // Fallback per modalità offline
        setIsAuthenticated(false);
      }
    }, 100);
  }, []);

  // Mentre verifichiamo l'autenticazione, mostriamo un loader
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Verifica accesso...</div>;
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
    const loginPath = requiredUserType === 'restaurant' 
      ? '/restaurant-login'
      : requiredUserType === 'admin'
      ? '/admin-login'
      : '/login';
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Se è richiesto un tipo specifico di utente, verifica che corrisponda
  if (requiredUserType && userType !== requiredUserType) {
    if (!sessionStorage.getItem('userTypeRedirectNotified')) {
      toast.error(`Accesso come ${requiredUserType} richiesto`);
      sessionStorage.setItem('userTypeRedirectNotified', 'true');
      // Reset dopo 5 secondi
      setTimeout(() => sessionStorage.removeItem('userTypeRedirectNotified'), 5000);
    }
    
    // Determina la pagina di login in base al tipo di utente richiesto
    const loginPath = requiredUserType === 'restaurant' 
      ? '/restaurant-login'
      : requiredUserType === 'admin'
      ? '/admin-login'
      : '/login';
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Se l'utente è autenticato e ha il tipo corretto, mostra il contenuto
  return <>{children}</>;
};

export default AuthGuard;
