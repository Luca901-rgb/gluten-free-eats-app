
import React, { ReactNode, useState, useEffect } from 'react';
import RestaurantNavBar from './RestaurantNavBar';
import { toast } from 'sonner';
import LoadingScreen from '../LoadingScreen';

interface RestaurantLayoutProps {
  children: ReactNode;
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handler per errori globali di rendering
  useEffect(() => {
    console.log("RestaurantLayout mounted");
    
    // Simula un breve caricamento per garantire che tutto sia pronto
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    const handleError = (event: ErrorEvent) => {
      console.error("Caught global error:", event.error);
      setHasError(true);
      toast.error("Si è verificato un errore. Ricarica la pagina.");
    };

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Caricamento layout..." timeout={1000} />;
  }

  if (hasError) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#a3e0a8] p-4">
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#a3e0a8] overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-16 w-full">
        {children}
      </div>
      <RestaurantNavBar />
    </div>
  );
};

export default RestaurantLayout;
