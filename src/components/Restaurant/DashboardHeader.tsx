
import React, { useState } from 'react';
import { MapPin, Star, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardHeaderProps {
  restaurantData: {
    id?: string;
    name: string;
    address: string;
    rating: number;
    totalReviews: number;
    coverImage: string;
  };
}

const DashboardHeader = ({ restaurantData }: DashboardHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState(restaurantData.coverImage);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Controllo dimensioni file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'immagine deve essere inferiore a 5MB");
      return;
    }
    
    // Controllo tipo file
    if (!file.type.startsWith('image/')) {
      toast.error("Il file deve essere un'immagine");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Verifica che l'utente sia autenticato
      const user = auth.currentUser;
      if (!user) {
        toast.error("Devi essere autenticato per caricare immagini");
        setIsUploading(false);
        return;
      }
      
      // Verifica che il ristorante abbia un ID
      if (!restaurantData.id) {
        toast.error("ID ristorante non disponibile");
        setIsUploading(false);
        return;
      }
      
      // Crea un riferimento per l'immagine nel bucket di Firebase Storage
      const storageRef = ref(storage, `restaurants/${restaurantData.id}/coverImage_${Date.now()}`);
      
      // Carica il file
      await uploadBytes(storageRef, file);
      
      // Ottieni l'URL di download
      const downloadURL = await getDownloadURL(storageRef);
      
      // Aggiorna il documento del ristorante con il nuovo URL dell'immagine
      const restaurantRef = doc(db, "restaurants", restaurantData.id);
      await updateDoc(restaurantRef, {
        coverImage: downloadURL
      });
      
      // Aggiorna l'UI
      setCoverImage(downloadURL);
      
      toast.success("Immagine di copertina aggiornata con successo");
    } catch (error) {
      console.error("Errore durante il caricamento dell'immagine:", error);
      toast.error("Errore durante il caricamento dell'immagine");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-56 md:h-72">
      <img 
        src={coverImage} 
        alt={restaurantData.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
        <div className="text-white">
          <h1 className="font-poppins font-bold text-2xl mb-1">{restaurantData.name}</h1>
          <div className="flex items-center mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(restaurantData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm ml-2">{restaurantData.totalReviews} recensioni</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{restaurantData.address}</span>
          </div>
        </div>
      </div>
      
      {/* Pulsante per caricare l'immagine di copertina */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <input 
            type="file" 
            id="cover-image-upload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button 
            size="sm" 
            className="bg-white/90 text-gray-800 hover:bg-white"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" /> 
                Caricamento...
              </>
            ) : (
              <>
                <Upload size={14} className="mr-1" /> 
                Cambia copertina
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
