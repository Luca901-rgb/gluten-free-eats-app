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

// Definizione approssimativa dei confini della Campania - ampliati per assicurarsi che Napoli sia inclusa
const CAMPANIA_REGION: Region = {
  name: "Campania",
  bounds: {
    north: 41.6, // Limite nord approssimativo - ampliato
    south: 39.8, // Limite sud approssimativo - ampliato
    east: 16.0,  // Limite est approssimativo - ampliato
    west: 13.7   // Limite ovest approssimativo - ampliato
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
  console.log("Verifica regione per le coordinate:", coords);
  
  // In modalità di sviluppo, ritorna sempre true
  if (import.meta.env.DEV) {
    console.log("Modalità sviluppo: regione sempre disponibile");
    return { inRegion: true, regionName: "Campania (Sviluppo)" };
  }
  
  for (const region of AVAILABLE_REGIONS) {
    const { bounds } = region;
    console.log(`Verificando confini della regione ${region.name}:`, bounds);
    if (
      coords.lat <= bounds.north &&
      coords.lat >= bounds.south &&
      coords.lng <= bounds.east &&
      coords.lng >= bounds.west
    ) {
      console.log(`Coordinate in regione: ${region.name}`);
      return { inRegion: true, regionName: region.name };
    }
  }
  
  console.log("Coordinate NON in regione disponibile");
  
  // Per testing, permettiamo comunque l'accesso
  return { inRegion: true, regionName: "Fuori Campania (ma permesso per testing)" };
};

/**
 * Verifica se l'app ha i permessi di geolocalizzazione
 * Restituisce una promessa che si risolve con un boolean che indica se l'app ha i permessi
 */
export const checkGeolocationPermission = async (): Promise<boolean> => {
  // Verifica per browser web moderni
  if (typeof navigator !== 'undefined' && navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return result.state === 'granted';
    } catch (e) {
      console.error("Errore nel controllo dei permessi:", e);
      return false;
    }
  }
  
  // Metodo alternativo per verificare i permessi
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }
    
    // Timeout breve per verificare se la geolocalizzazione è disponibile
    const timeoutId = setTimeout(() => {
      console.log("Timeout durante il controllo dei permessi di geolocalizzazione");
      resolve(false);
    }, 3000);
    
    navigator.geolocation.getCurrentPosition(
      () => {
        clearTimeout(timeoutId);
        resolve(true);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.log("Errore durante il controllo dei permessi:", error.code, error.message);
        resolve(false);
      },
      { timeout: 2000, maximumAge: 0 }
    );
  });
};

/**
 * Richiede i permessi di geolocalizzazione in modo esplicito
 * Ideale da chiamare in risposta a un'azione utente come un click
 */
export const requestGeolocationPermission = (): Promise<boolean> => {
  console.log("Richiesta permessi di geolocalizzazione...");
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocalizzazione non supportata");
      resolve(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Permessi di geolocalizzazione concessi, posizione ottenuta:", position.coords);
        resolve(true);
      },
      (error) => {
        console.error("Permessi di geolocalizzazione negati:", error.code, error.message);
        // Codici di errore:
        // 1: PERMISSION_DENIED
        // 2: POSITION_UNAVAILABLE
        // 3: TIMEOUT
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

/**
 * Ottiene la posizione dell'utente e verifica se è in una regione disponibile
 */
export const checkUserRegion = (): Promise<{ inRegion: boolean; regionName?: string; error?: string }> => {
  console.log("Verifica della regione utente...");
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
        console.log("Posizione ottenuta:", position.coords);
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
        
        console.error("Errore geolocalizzazione:", errorMessage, "Codice:", error.code);
        
        // In caso di errore, permettiamo comunque di accedere all'app
        // per non bloccare completamente l'esperienza utente
        resolve({ 
          inRegion: false, 
          error: errorMessage 
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,  // Aumentato il timeout a 15 secondi
        maximumAge: 0  // Non usare cache
      }
    );
  });
};
