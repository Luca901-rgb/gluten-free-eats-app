
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  DocumentReference 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export type FirestoreDocument = Record<string, any>;

export const useFirestore = <T extends FirestoreDocument>(collectionName: string) => {
  const [documents, setDocuments] = useState<(T & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get a document by ID
  const getDocument = async (id: string): Promise<(T & { id: string }) | null> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() as T };
      }
      
      return null;
    } catch (err: any) {
      console.error(`Error getting document from ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // Get all documents in a collection
  const getAllDocuments = async (): Promise<(T & { id: string })[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as T
      }));
      
      setDocuments(docs);
      return docs;
    } catch (err: any) {
      console.error(`Error getting documents from ${collectionName}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a document to a collection
  const addDocument = async (data: T, customId?: string): Promise<string> => {
    try {
      const docRef = customId 
        ? doc(db, collectionName, customId)
        : doc(collection(db, collectionName));
        
      const timestamp = serverTimestamp();
      const dataWithTimestamps = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      await setDoc(docRef, dataWithTimestamps);
      return docRef.id;
    } catch (err: any) {
      console.error(`Error adding document to ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // Update a document in a collection
  const updateDocument = async (id: string, data: Partial<T>): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      const dataWithTimestamp = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
    } catch (err: any) {
      console.error(`Error updating document in ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // Delete a document from a collection
  const deleteDocument = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err: any) {
      console.error(`Error deleting document from ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  // Subscribe to a collection
  const subscribeToCollection = (callback: (docs: (T & { id: string })[]) => void) => {
    const q = collection(db, collectionName);
    
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as T
      }));
      
      callback(docs);
      setDocuments(docs);
      setIsLoading(false);
    }, (err) => {
      console.error(`Error subscribing to ${collectionName}:`, err);
      setError(err.message);
    });
  };

  // Subscribe to a document
  const subscribeToDocument = (id: string, callback: (doc: (T & { id: string }) | null) => void) => {
    const docRef = doc(db, collectionName, id);
    
    return onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const document = { id: docSnapshot.id, ...docSnapshot.data() as T };
        callback(document);
      } else {
        callback(null);
      }
    }, (err) => {
      console.error(`Error subscribing to document in ${collectionName}:`, err);
      setError(err.message);
    });
  };

  // Query documents
  const queryDocuments = async (
    fieldPath: string, 
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains" | "in" | "array-contains-any" | "not-in", 
    value: any
  ): Promise<(T & { id: string })[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const q = query(collection(db, collectionName), where(fieldPath, operator, value));
      const querySnapshot = await getDocs(q);
      
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as T
      }));
      
      return docs;
    } catch (err: any) {
      console.error(`Error querying documents in ${collectionName}:`, err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get documents of the current user
  const getUserDocuments = async (userIdField: string = 'userId'): Promise<(T & { id: string })[]> => {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }
    
    return queryDocuments(userIdField, "==", user.uid);
  };

  // Return the hook interface
  return {
    documents,
    isLoading,
    error,
    getDocument,
    getAllDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    subscribeToCollection,
    subscribeToDocument,
    queryDocuments,
    getUserDocuments
  };
};
