
interface Coordinates {
  lat: number;
  lng: number;
}

interface Region {
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }
}

// Definizione approssimativa dei confini della Campania
const CAMPANIA_REGION: Region = {
  name: "Campania",
  bounds: {
    north: 41.5, // Limite nord approssimativo
    south: 39.9, // Limite sud approssimativo
    east: 15.8,  // Limite est approssimativo
    west: 13.8   // Limite ovest approssimativo
  }
};

// Lista delle regioni in cui il servizio è disponibile
export const AVAILABLE_REGIONS: Region[] = [
  CAMPANIA_REGION
];

/**
 * Verifica se le coordinate sono all'interno della regione Campania
 */
export const isInAvailableRegion = (coords: Coordinates): { inRegion: boolean; regionName?: string } => {
  for (const region of AVAILABLE_REGIONS) {
    const { bounds } = region;
    if (
      coords.lat <= bounds.north &&
      coords.lat >= bounds.south &&
      coords.lng <= bounds.east &&
      coords.lng >= bounds.west
    ) {
      return { inRegion: true, regionName: region.name };
    }
  }
  
  return { inRegion: false };
};

/**
 * Per app mobile: Verifica se l'app ha i permessi di geolocalizzazione
 */
export const checkGeolocationPermission = async (): Promise<boolean> => {
  // Per app web standard
  if (typeof navigator !== 'undefined' && navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return result.state === 'granted';
    } catch (e) {
      console.error("Errore nel controllo dei permessi:", e);
      return false;
    }
  }
  
  // Se non possiamo verificare i permessi, assumiamo che non li abbiamo
  return false;
};

/**
 * Ottiene la posizione dell'utente e verifica se è in una regione disponibile
 */
export const checkUserRegion = (): Promise<{ inRegion: boolean; regionName?: string; error?: string }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ 
        inRegion: false, 
        error: "La geolocalizzazione non è supportata dal tuo browser" 
      });
      return;
    }
    
    // In modalità di sviluppo, consentiamo sempre l'accesso
    if (import.meta.env.DEV) {
      resolve({ 
        inRegion: true, 
        regionName: "Campania (Sviluppo)" 
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        const regionCheck = isInAvailableRegion(coords);
        resolve({ 
          inRegion: regionCheck.inRegion, 
          regionName: regionCheck.regionName 
        });
      },
      (error) => {
        let errorMessage = "Errore nel recupero della posizione";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Accesso alla posizione negato. Verifica i permessi del dispositivo nelle impostazioni";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Le informazioni sulla posizione non sono disponibili";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo scaduto per la richiesta di posizione";
            break;
        }
        
        console.error("Errore geolocalizzazione:", errorMessage, error.code);
        
        // In caso di errore, permettiamo comunque di accedere all'app
        // per non bloccare completamente l'esperienza utente
        resolve({ 
          inRegion: true, 
          error: errorMessage 
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,  // Aumentato il timeout a 15 secondi
        maximumAge: 60000  // Cache valida per 1 minuto
      }
    );
  });
};

/**
 * Richiede i permessi di geolocalizzazione in modo esplicito
 * Utile da chiamare in risposta ad un click utente
 */
export const requestGeolocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      () => {
        // Successo
        resolve(true);
      },
      () => {
        // Errore
        resolve(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
