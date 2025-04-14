
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
  // Coordinata default per Napoli se l'utente non ha fornito posizione
  if (!coords || (!coords.lat && !coords.lng)) {
    return { inRegion: true, regionName: "Campania" };
  }
  
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
    // Se non abbiamo la geolocalizzazione, assumiamo che l'utente sia in Campania
    if (!navigator.geolocation) {
      resolve({ 
        inRegion: true, 
        regionName: "Campania",
        error: "Il tuo browser non supporta la geolocalizzazione" 
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      // Se scade il timeout, assumiamo che l'utente sia in Campania
      resolve({ 
        inRegion: true, 
        regionName: "Campania",
        error: "Timeout durante la richiesta della posizione" 
      });
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        const regionCheck = isInAvailableRegion(coords);
        resolve(regionCheck);
      },
      (error) => {
        clearTimeout(timeoutId);
        
        // In caso di errore, assumiamo che l'utente sia in Campania
        resolve({ 
          inRegion: true, 
          regionName: "Campania",
          error: "Si è verificato un errore con la geolocalizzazione. L'app continuerà a funzionare normalmente." 
        });
      }
    );
  });
};
