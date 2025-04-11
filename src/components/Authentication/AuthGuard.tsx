
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

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
    // Verifica se l'utente è autenticato
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedUserType = localStorage.getItem('userType');
    
    setIsAuthenticated(authStatus === 'true');
    setUserType(storedUserType);
  }, []);

  // Mentre verifichiamo l'autenticazione, mostriamo un loader
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Verifica accesso...</div>;
  }

  // Se l'utente non è autenticato, lo reindirizziamo al login
  if (!isAuthenticated) {
    toast.error("Accesso richiesto per visualizzare questa pagina");
    
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
    toast.error(`Accesso come ${requiredUserType} richiesto`);
    
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
