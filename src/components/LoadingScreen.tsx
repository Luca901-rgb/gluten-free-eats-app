
import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  timeout?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Caricamento...', 
  timeout = 15000 
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
      <div className="w-16 h-16 flex items-center justify-center">
        <Loader className="w-12 h-12 text-primary animate-spin" />
      </div>
      <p className="mt-4 text-lg text-gray-600">{message}</p>
      
      {showTimeout && (
        <div className="mt-6 max-w-xs text-center">
          <p className="text-sm text-amber-600">
            Il caricamento sta richiedendo più tempo del previsto. 
            Verifica la tua connessione o aggiorna la pagina.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
