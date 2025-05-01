
/**
 * Utility per l'accesso sicuro al localStorage con fallback
 */

// Memoria in-memory come fallback quando localStorage non è disponibile
const memoryStorage: Record<string, string> = {};

/**
 * Verifica se localStorage è disponibile
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('localStorage non disponibile:', e);
    return false;
  }
};

/**
 * Storage sicuro con fallback a memoria in-app
 */
const safeStorage = {
  isAvailable: isStorageAvailable(),
  
  setItem: (key: string, value: string): void => {
    try {
      if (isStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        // Usa memoria in-app come fallback
        memoryStorage[key] = value;
        console.log(`Dato salvato in memoria in-app: ${key}`);
      }
    } catch (e) {
      // In caso di errore, salva in memoria
      memoryStorage[key] = value;
      console.warn(`Errore localStorage, dato salvato in memoria: ${key}`, e);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      if (isStorageAvailable()) {
        return localStorage.getItem(key);
      } else {
        // Recupera da memoria in-app
        return memoryStorage[key] || null;
      }
    } catch (e) {
      console.warn(`Errore nel recuperare ${key} da localStorage:`, e);
      // Tenta recupero da memoria in-app
      return memoryStorage[key] || null;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      if (isStorageAvailable()) {
        localStorage.removeItem(key);
      }
      // Rimuovi anche dalla memoria in-app
      delete memoryStorage[key];
    } catch (e) {
      console.warn(`Errore nel rimuovere ${key}:`, e);
      // Assicurati che sia rimosso dalla memoria
      delete memoryStorage[key];
    }
  },
  
  clear: (): void => {
    try {
      if (isStorageAvailable()) {
        localStorage.clear();
      }
      // Pulisci memoria in-app
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    } catch (e) {
      console.warn('Errore nel pulire lo storage:', e);
      // Assicurati che memoria in-app sia pulita
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    }
  }
};

export default safeStorage;
