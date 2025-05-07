
import React, { ReactNode, useState, useEffect } from 'react';
import RestaurantNavBar from './RestaurantNavBar';
import { Loader } from 'lucide-react';

interface RestaurantLayoutProps {
  children: ReactNode;
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Garantiamo che il layout sia sempre visibile dopo un breve timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Cattura errori di rendering per evitare schermo vuoto
  try {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white overflow-hidden">
        {!isVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <Loader className="w-10 h-10 text-primary animate-spin" />
            <p className="ml-2 text-gray-600">Caricamento dashboard...</p>
          </div>
        )}
        <div className={`flex-1 overflow-y-auto pb-16 w-full ${isVisible ? 'block' : 'opacity-0'}`}>
          {renderError ? (
            <div className="p-6 text-center">
              <h2 className="text-lg font-medium text-red-600 mb-2">Si è verificato un errore</h2>
              <p className="text-gray-600 mb-4">Impossibile caricare il contenuto della dashboard</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Riprova
              </button>
            </div>
          ) : (
            children
          )}
        </div>
        <RestaurantNavBar />
      </div>
    );
  } catch (error) {
    // In caso di errore nel rendering, mostra un messaggio di fallback
    console.error("Errore nel rendering del layout:", error);
    setRenderError(error instanceof Error ? error : new Error("Errore sconosciuto"));
    
    return (
      <div className="flex flex-col min-h-screen w-full bg-white p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Impossibile caricare la dashboard</h2>
            <p className="text-gray-600 mb-4">Si è verificato un errore durante il caricamento.</p>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md"
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
};

export default RestaurantLayout;
