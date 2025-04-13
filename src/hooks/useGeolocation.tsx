import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Non chiedere i permessi immediatamente all'avvio dell'app
    if (sessionStorage.getItem('geolocationPermissionAsked')) {
      setPermissionAsked(true);
    }
  }, []);

  const requestLocation = () => {
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
    
    setState(prev => ({ ...prev, loading: true }));

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
              error: "Usando ultima posizione conosciuta",
              loading: false
            });
            return;
          }
        }
        
        let errorMsg = "Impossibile determinare la posizione";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Accesso alla posizione negato";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Informazioni sulla posizione non disponibili";
            break;
          case error.TIMEOUT:
            errorMsg = "Richiesta posizione scaduta";
            break;
        }
        
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
  };

  return {
    ...state,
    permissionAsked,
    requestLocation
  };
}