
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface GeolocationState {
  location: [number, number] | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false
  });
  
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [dismissedError, setDismissedError] = useState(false);

  // Funzione per cancellare gli errori
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    setDismissedError(true);
    // Salva nei session storage che l'errore è stato dismesso
    sessionStorage.setItem('geolocationErrorDismissed', 'true');
  }, []);

  useEffect(() => {
    // Controlla se l'autorizzazione è già stata richiesta
    if (sessionStorage.getItem('geolocationPermissionAsked')) {
      setPermissionAsked(true);
    }
    
    // Controlla se l'errore è già stato dismesso in questa sessione
    if (sessionStorage.getItem('geolocationErrorDismissed')) {
      setDismissedError(true);
    }
    
    // Auto-dismetti gli errori dopo 5 secondi
    if (state.error && !dismissedError) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.error, dismissedError, clearError]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "La geolocalizzazione non è supportata dal browser",
        loading: false
      }));
      return;
    }

    setPermissionAsked(true);
    sessionStorage.setItem('geolocationPermissionAsked', 'true');
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          location: [latitude, longitude],
          error: null,
          loading: false
        });
        
        // Salva la posizione in localStorage per uso offline
        localStorage.setItem('lastKnownLocation', JSON.stringify([latitude, longitude]));
        localStorage.setItem('locationTimestamp', Date.now().toString());
      },
      (error) => {
        console.error("Errore geolocalizzazione:", error);
        
        // Se l'errore è già stato dismesso in questa sessione, non mostrarlo di nuovo
        if (dismissedError) {
          setState(prev => ({
            ...prev,
            loading: false
          }));
          return;
        }
        
        // Recupera l'ultima posizione conosciuta se disponibile
        const lastLocation = localStorage.getItem('lastKnownLocation');
        const timestamp = localStorage.getItem('locationTimestamp');
        
        if (lastLocation && timestamp) {
          const locationAge = Date.now() - parseInt(timestamp);
          // Usa l'ultima posizione conosciuta se è recente (meno di 1 ora)
          if (locationAge < 3600000) {
            setState({
              location: JSON.parse(lastLocation),
              error: "Utilizzando ultima posizione conosciuta",
              loading: false
            });
            return;
          }
        }
        
        let errorMsg = "Accesso alla posizione negato. Tocca per chiudere.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Accesso alla posizione negato. Verifica i permessi del browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Posizione non disponibile.";
            break;
          case error.TIMEOUT:
            errorMsg = "Richiesta posizione scaduta.";
            break;
        }
        
        // Notifica breve e non bloccante
        toast.error(errorMsg, {
          duration: 3000,
          dismissible: true
        });
        
        setState({
          location: null,
          error: errorMsg,
          loading: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [dismissedError]);

  return {
    ...state,
    permissionAsked,
    requestLocation,
    clearError
  };
}
