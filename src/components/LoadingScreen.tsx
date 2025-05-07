
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
  timeout = 5000,
  onRetry
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    // Show timeout message faster (after 1.5 seconds)
    const timeoutTimer = setTimeout(() => {
      setShowTimeout(true);
    }, 1500);
    
    // Show error message after 3 seconds
    const errorTimer = setTimeout(() => {
      setShowError(true);
    }, 3000);
    
    return () => {
      clearTimeout(timeoutTimer);
      clearTimeout(errorTimer);
    };
  }, []);

  const handleRetry = () => {
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-4">
      <div className="w-16 h-16 flex items-center justify-center">
        <Loader className="w-12 h-12 text-primary animate-spin" />
      </div>
      <p className="mt-4 text-lg text-gray-600">{message}</p>
      
      {showTimeout && (
        <div className="mt-6 max-w-xs text-center">
          <p className="text-sm text-amber-600">
            Il caricamento sta richiedendo più tempo del previsto. 
            {showError && " Potrebbe esserci un problema di connessione."}
          </p>
          
          {showError && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="mt-3 flex items-center gap-2"
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
