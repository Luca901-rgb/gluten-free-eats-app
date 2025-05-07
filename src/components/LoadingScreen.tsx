
import React, { useEffect, useState } from 'react';
import { Loader, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface LoadingScreenProps {
  message?: string;
  timeout?: number;
  onRetry?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Caricamento...', 
  timeout = 3000,
  onRetry
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    console.log("LoadingScreen mounted with message:", message);
    
    // Show timeout message after 1 second
    const timeoutTimer = setTimeout(() => {
      console.log("LoadingScreen: showing timeout message");
      setShowTimeout(true);
    }, 800); // Reduced from 1000
    
    // Show error/retry after 2 seconds
    const errorTimer = setTimeout(() => {
      console.log("LoadingScreen: showing error/retry option");
      setShowError(true);
    }, 1500); // Reduced from 2000
    
    return () => {
      clearTimeout(timeoutTimer);
      clearTimeout(errorTimer);
    };
  }, []);

  const handleRetry = () => {
    console.log("LoadingScreen: retry clicked");
    if (onRetry) {
      onRetry();
      setShowTimeout(false);
      setShowError(false);
    } else {
      // Se non è fornita una funzione di retry, ricarica la pagina
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-4 border border-gray-200 rounded-md shadow-sm m-2">
      <div className="w-16 h-16 flex items-center justify-center">
        <Loader className="w-12 h-12 text-green-500 animate-spin" />
      </div>
      <p className="mt-4 text-lg text-gray-600 font-medium">{message}</p>
      
      {showTimeout && (
        <div className="mt-6 max-w-xs text-center">
          <p className="text-sm text-amber-600 font-medium">
            Il caricamento sta richiedendo più tempo del previsto. 
            {showError && " Potrebbe esserci un problema di connessione."}
          </p>
          
          {showError && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="mt-3 flex items-center gap-2 bg-white"
            >
              <RefreshCw size={14} />
              Riprova
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
