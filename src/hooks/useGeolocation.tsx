
import { useState, useEffect, useCallback } from 'react';

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
  const [dismissedError, setDismissedError] = useState(true); // Default a true per non mostrare errori

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
    
    // Imposta di default che l'errore è dismesso
    setDismissedError(true);
    sessionStorage.setItem('geolocationErrorDismissed', 'true');
    
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Silenziosamente fallisce senza errore visibile
      setState(prev => ({
        ...prev,
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
        
        // Recupera l'ultima posizione conosciuta se disponibile
        const lastLocation = localStorage.getItem('lastKnownLocation');
        const timestamp = localStorage.getItem('locationTimestamp');
        
        if (lastLocation && timestamp) {
          const locationAge = Date.now() - parseInt(timestamp);
          // Usa l'ultima posizione conosciuta se è recente (meno di 1 ora)
          if (locationAge < 3600000) {
            setState({
              location: JSON.parse(lastLocation),
              error: null, // Nessun messaggio di errore
              loading: false
            });
            return;
          }
        }
        
        // Non mostriamo messaggi di errore, semplicemente terminiamo il caricamento
        setState({
          location: null,
          error: null,
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
