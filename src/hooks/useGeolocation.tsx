import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Coordinate predefinite (centro di Napoli)
const FALLBACK_LOCATION: [number, number] = [40.8417, 14.2681];
const FALLBACK_ERROR_MESSAGE = "Posizione non rilevata. Mostrati ristoranti in Campania.";

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

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    setDismissedError(true);
    sessionStorage.setItem('geolocationErrorDismissed', 'true');
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('geolocationPermissionAsked')) {
      setPermissionAsked(true);
    }
    
    if (sessionStorage.getItem('geolocationErrorDismissed')) {
      setDismissedError(true);
    }
    
    if (state.error && !dismissedError) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.error, dismissedError, clearError]);

  const requestLocation = useCallback(() => {
    // Se la geolocalizzazione non è supportata, usa la posizione predefinita
    if (!navigator.geolocation) {
      toast.warning("Geolocalizzazione non supportata. Utilizzata posizione predefinita.", {
        duration: 5000
      });
      
      setState({
        location: FALLBACK_LOCATION,
        error: "Geolocalizzazione non supportata.",
        loading: false
      });
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
        
        localStorage.setItem('lastKnownLocation', JSON.stringify([latitude, longitude]));
        localStorage.setItem('locationTimestamp', Date.now().toString());
      },
      (error) => {
        console.error("Errore geolocalizzazione:", error);
        
        // Recupera l'ultima posizione conosciuta se disponibile
        const lastLocation = localStorage.getItem('lastKnownLocation');
        const timestamp = localStorage.getItem('locationTimestamp');
        
        let selectedLocation = FALLBACK_LOCATION;
        let errorMessage = FALLBACK_ERROR_MESSAGE;

        if (lastLocation && timestamp) {
          const locationAge = Date.now() - parseInt(timestamp);
          // Usa l'ultima posizione conosciuta se è recente (meno di 1 ora)
          if (locationAge < 3600000) {
            selectedLocation = JSON.parse(lastLocation);
            errorMessage = "Utilizzando ultima posizione conosciuta";
          }
        }

        // Imposta lo stato con la posizione di fallback
        setState({
          location: selectedLocation,
          error: errorMessage,
          loading: false
        });

        // Mostra un toast con l'errore
        toast.warning(errorMessage, {
          duration: 5000,
          description: "Stiamo mostrando i ristoranti nella regione Campania."
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
