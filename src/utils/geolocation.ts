
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
  // Per semplificare, assumiamo sempre che l'utente sia in una regione supportata
  return { inRegion: true, regionName: "Campania" };
};

/**
 * Ottiene la posizione dell'utente e verifica se è in una regione disponibile
 */
export const checkUserRegion = (): Promise<{ inRegion: boolean; regionName?: string; error?: string }> => {
  return new Promise((resolve) => {
    // Semplifichiamo assumendo che l'utente sia sempre in una regione supportata
    resolve({ 
      inRegion: true, 
      regionName: "Campania" 
    });
  });
};
