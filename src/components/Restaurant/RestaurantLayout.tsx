
import React, { ReactNode, useState, useEffect } from 'react';
import RestaurantNavBar from './RestaurantNavBar';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

interface RestaurantLayoutProps {
  children: ReactNode;
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Log per debug
  useEffect(() => {
    console.log("RestaurantLayout mounted");
    
    // Garantiamo che il layout sia sempre visibile dopo un breve timeout
    const timer = setTimeout(() => {
      console.log("Setting visibility to true");
      setIsVisible(true);
      setIsInitialized(true);
    }, 300);
    
    // Fallback per garantire che l'UI sia sempre visibile
    const fallbackTimer = setTimeout(() => {
      if (!isVisible) {
        console.log("Force visibility via fallback");
        setIsVisible(true);
        setIsInitialized(true);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Handler per errori globali di rendering
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught global error:", event.error);
      setHasError(true);
      toast.error("Si è verificato un errore. Ricarica la pagina.");
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Impossibile caricare la dashboard</h2>
            <p className="text-gray-600 mb-4">Si è verificato un errore durante il caricamento.</p>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Ricarica pagina
            </button>
          </div>
        </div>
        <RestaurantNavBar />
      </div>
    );
  }

  // Renderizza un fallback se il layout non è ancora inizializzato
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <Loader className="w-10 h-10 text-green-500 animate-spin" />
        <p className="mt-4 text-gray-600">Inizializzazione dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white overflow-hidden">
      {!isVisible ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <Loader className="w-10 h-10 text-green-500 animate-spin" />
          <p className="ml-2 text-gray-600">Caricamento dashboard...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-16 w-full">
          {children}
        </div>
      )}
      <RestaurantNavBar />
    </div>
  );
};

export default RestaurantLayout;
