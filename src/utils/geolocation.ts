
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
    if (
      coords.lat <= region.bounds.north &&
      coords.lat >= region.bounds.south &&
      coords.lng <= region.bounds.east &&
      coords.lng >= region.bounds.west
    ) {
      return { inRegion: true, regionName: region.name };
    }
  }
  
  return { inRegion: false };
};

/**
 * Ottiene la posizione dell'utente e verifica se è in una regione disponibile
 */
export const checkUserRegion = (): Promise<{ inRegion: boolean; regionName?: string; error?: string }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ 
        inRegion: false, 
        error: "Il tuo browser non supporta la geolocalizzazione" 
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
        resolve(regionCheck);
      },
      (error) => {
        let errorMessage = "Impossibile determinare la tua posizione.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Accesso alla posizione negato. Verifica i permessi del browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Dati sulla posizione non disponibili.";
            break;
          case error.TIMEOUT:
            errorMessage = "Timeout durante la richiesta della posizione.";
            break;
        }
        
        resolve({ inRegion: false, error: errorMessage });
      }
    );
  });
};
