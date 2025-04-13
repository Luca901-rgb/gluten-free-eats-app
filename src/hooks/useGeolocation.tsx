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
    loading: true
  });
  
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [dismissedError, setDismissedError] = useState(false);

  // Funzione per cancellare i messaggi di errore
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    setDismissedError(true);
  }, []);

  useEffect(() => {
    // Non chiedere i permessi immediatamente all'avvio dell'app
    if (sessionStorage.getItem('geolocationPermissionAsked')) {
      setPermissionAsked(true);
    }
    
    // Imposta un timer per pulire automaticamente gli errori dopo 5 secondi
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
        console.error("Errore geolocalizzazione:", error.message);
        
        // Recupera l'ultima posizione conosciuta se disponibile
        const lastLocation = localStorage.getItem('lastKnownLocation');
        const timestamp = localStorage.getItem('locationTimestamp');
        
        if (lastLocation && timestamp) {
          const locationAge = Date.now() - parseInt(timestamp);
          // Usa l'ultima posizione conosciuta se è recente (meno di 1 ora)
          if (locationAge < 3600000) {
            setState({
              location: JSON.parse(lastLocation),
              error: "Utilizzando ultima posizione conosciuta. Tocca per chiudere.",
              loading: false
            });
            return;
          }
        }
        
        let errorMsg = "Accesso alla posizione negato. Puoi attivarlo nelle impostazioni. Tocca per chiudere.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Accesso alla posizione negato. Puoi attivarlo nelle impostazioni. Tocca per chiudere.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Informazioni sulla posizione non disponibili. Tocca per chiudere.";
            break;
          case error.TIMEOUT:
            errorMsg = "Richiesta posizione scaduta. Tocca per chiudere.";
            break;
        }
        
        // Mostra un toast meno invadente invece di errori persistenti
        toast.error(errorMsg, {
          duration: 5000,
          onDismiss: clearError
        });
        
        setState({
          location: null,
          error: errorMsg,
          loading: false
        });
        
        // Non mostrare lo stesso errore più volte nella stessa sessione
        if (!sessionStorage.getItem('geolocationErrorShown')) {
          sessionStorage.setItem('geolocationErrorShown', 'true');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [clearError]);

  return {
    ...state,
    permissionAsked,
    requestLocation,
    clearError
  };
}