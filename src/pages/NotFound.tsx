
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Verifica se l'utente stava cercando di accedere a una pagina del ristorante
  const isRestaurantRoute = location.pathname.includes('restaurant');
  const isAdminRoute = location.pathname.includes('admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Pagina non trovata</p>
        
        {isRestaurantRoute && (
          <div className="bg-blue-50 p-4 rounded-md mb-6 text-left">
            <p className="text-blue-800 mb-2">Stai cercando una pagina del ristorante?</p>
            <ul className="text-blue-700 text-sm list-disc pl-5 space-y-1">
              <li>Assicurati di aver effettuato l'accesso</li>
              <li>Controlla che l'URL sia corretto</li>
              <li>Se sei un ristoratore, usa la dashboard ristorante</li>
            </ul>
          </div>
        )}
        
        {isAdminRoute && (
          <div className="bg-purple-50 p-4 rounded-md mb-6 text-left">
            <p className="text-purple-800 mb-2">Stai cercando il pannello amministrativo?</p>
            <ul className="text-purple-700 text-sm list-disc pl-5 space-y-1">
              <li>Assicurati di avere i permessi di amministratore</li>
              <li>Effettua l'accesso con le credenziali di amministratore</li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link to="/" className="flex items-center gap-2">
              <Home size={16} />
              Torna alla Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/login" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Vai al Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
