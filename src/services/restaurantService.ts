
import { db, auth } from '../lib/firebase';
import { doc, setDoc, collection, addDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { RestaurantRegistrationForm } from '@/types/restaurantRegistration';
import { toast } from 'sonner';
import safeStorage from '@/lib/safeStorage';

/**
 * Crea un nuovo ristorante nel database
 */
export const createRestaurant = async (restaurantData: RestaurantRegistrationForm, userId?: string): Promise<string> => {
  try {
    // Ottieni l'ID utente corrente da Firebase Auth o dal parametro passato
    const currentUser = auth.currentUser;
    const ownerId = userId || currentUser?.uid || safeStorage.getItem('userId');
    
    if (!ownerId) {
      throw new Error('Nessun utente autenticato trovato');
    }
    
    // Aggiungi metadati al documento ristorante
    const restaurantWithMetadata = {
      ...restaurantData,
      ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active',
      averageRating: 0,
      totalRatings: 0,
      totalBookings: 0
    };
    
    // Crea un nuovo documento nella collezione restaurants con un ID generato automaticamente
    const restaurantRef = collection(db, 'restaurants');
    const docRef = await addDoc(restaurantRef, restaurantWithMetadata);
    
    console.log(`Ristorante creato con ID: ${docRef.id}`);
    
    // Aggiorna il documento utente per indicare che è un proprietario di ristorante
    // e salva il riferimento al ristorante
    const userRef = doc(db, 'users', ownerId);
    
    // Verifica se il documento utente esiste prima di aggiornarlo
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        isRestaurantOwner: true,
        restaurantId: docRef.id,
        userType: 'restaurant',
        updatedAt: serverTimestamp()
      });
    } else {
      // Se non esiste, crea un nuovo documento utente
      await setDoc(userRef, {
        isRestaurantOwner: true,
        restaurantId: docRef.id,
        userType: 'restaurant',
        email: restaurantData.manager.email,
        displayName: restaurantData.manager.name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Memorizza le informazioni anche in localStorage per accesso offline
    safeStorage.setItem('restaurantId', docRef.id);
    safeStorage.setItem('isRestaurantOwner', 'true');
    safeStorage.setItem('userType', 'restaurant');
    
    return docRef.id;
  } catch (error) {
    console.error('Errore durante la creazione del ristorante:', error);
    
    // Salviamo comunque i dati in localStorage come fallback
    safeStorage.setItem('restaurantRegistrationData', JSON.stringify(restaurantData));
    safeStorage.setItem('restaurantPendingCreation', 'true');
    safeStorage.setItem('isRestaurantOwner', 'true');
    safeStorage.setItem('userType', 'restaurant');
    
    throw error;
  }
};

/**
 * Aggiorna un ristorante esistente
 */
export const updateRestaurant = async (restaurantId: string, restaurantData: Partial<RestaurantRegistrationForm>) => {
  try {
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    
    await updateDoc(restaurantRef, {
      ...restaurantData,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Ristorante ${restaurantId} aggiornato con successo`);
    return true;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del ristorante:', error);
    throw error;
  }
};

/**
 * Ottiene i dati di un ristorante
 */
export const getRestaurant = async (restaurantId: string) => {
  try {
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);
    
    if (restaurantDoc.exists()) {
      return {
        id: restaurantDoc.id,
        ...restaurantDoc.data()
      };
    } else {
      console.warn(`Ristorante ${restaurantId} non trovato`);
      return null;
    }
  } catch (error) {
    console.error('Errore durante il recupero del ristorante:', error);
    throw error;
  }
};

/**
 * Verifica se esistono ristoranti in attesa di creazione nel database
 * e li crea se necessario (utile per sincronizzare dopo operazioni offline)
 */
export const syncPendingRestaurants = async () => {
  try {
    const pendingCreation = safeStorage.getItem('restaurantPendingCreation');
    const restaurantData = safeStorage.getItem('restaurantRegistrationData');
    
    if (pendingCreation === 'true' && restaurantData) {
      console.log('Trovato ristorante in attesa di creazione, tentativo di sincronizzazione...');
      
      // Parse dei dati
      const parsedData = JSON.parse(restaurantData);
      
      // Crea il ristorante nel database
      const restaurantId = await createRestaurant(parsedData);
      
      // Rimuovi i flag di pending
      safeStorage.removeItem('restaurantPendingCreation');
      
      toast.success('Il tuo ristorante è stato sincronizzato con successo');
      
      return restaurantId;
    }
    
    return null;
  } catch (error) {
    console.error('Errore durante la sincronizzazione dei ristoranti pendenti:', error);
    return null;
  }
};

/**
 * Ottiene l'ID del ristorante associato all'utente corrente
 */
export const getCurrentUserRestaurantId = async (): Promise<string | null> => {
  try {
    // Prima controlla in localStorage
    const storedRestaurantId = safeStorage.getItem('restaurantId');
    
    if (storedRestaurantId) {
      return storedRestaurantId;
    }
    
    // Se non c'è in localStorage, controlla su Firestore
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return null;
    }
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().restaurantId) {
      const restaurantId = userDoc.data().restaurantId;
      
      // Salva in localStorage per accesso futuro
      safeStorage.setItem('restaurantId', restaurantId);
      
      return restaurantId;
    }
    
    return null;
  } catch (error) {
    console.error('Errore durante il recupero dell\'ID ristorante:', error);
    return null;
  }
};
