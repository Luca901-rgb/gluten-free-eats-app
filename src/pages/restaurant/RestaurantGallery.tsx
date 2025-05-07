
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Image, Upload, Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

// Immagini di esempio per la galleria
const sampleImages = {
  environment: [
    { url: '/placeholder.svg', caption: 'Sala principale' },
    { url: '/placeholder.svg', caption: 'Area esterna' },
    { url: '/placeholder.svg', caption: 'Bar' }
  ],
  dishes: [
    { url: '/placeholder.svg', caption: 'Spaghetti alla carbonara' },
    { url: '/placeholder.svg', caption: 'Tagliata di manzo' },
    { url: '/placeholder.svg', caption: 'Tiramisù' }
  ]
};

const RestaurantGallery = () => {
  const [galleryImages, setGalleryImages] = useState({
    environment: [...sampleImages.environment],
    dishes: [...sampleImages.dishes]
  });
  
  // Carica le immagini dalla registrazione del ristorante se disponibili
  React.useEffect(() => {
    try {
      const registrationData = localStorage.getItem('restaurantRegistrationData');
      if (registrationData) {
        const parsed = JSON.parse(registrationData);
        if (parsed.media?.gallery) {
          const gallery = parsed.media.gallery;
          
          setGalleryImages(prev => ({
            environment: gallery.environment && gallery.environment.length > 0 ? 
              gallery.environment : prev.environment,
            dishes: gallery.dishes && gallery.dishes.length > 0 ? 
              gallery.dishes : prev.dishes
          }));
        }
      }
    } catch (error) {
      console.error("Errore nel caricamento della galleria:", error);
    }
  }, []);
  
  const handleImageUpload = (category: 'environment' | 'dishes') => {
    // In un'implementazione reale, qui gestiremmo l'upload delle immagini
    toast.info("Funzionalità di upload in sviluppo");
    
    // Per ora aggiungiamo un'immagine di esempio
    setGalleryImages(prev => ({
      ...prev,
      [category]: [
        ...prev[category],
        { url: '/placeholder.svg', caption: 'Nuova immagine' }
      ]
    }));
  };
  
  const handleImageDelete = (category: 'environment' | 'dishes', index: number) => {
    setGalleryImages(prev => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== index)
    }));
    
    toast.success("Immagine rimossa dalla galleria");
  };
  
  const ImageGallery = ({ images, category }: { images: Array<{url: string, caption?: string}>, category: 'environment' | 'dishes' }) => {
    return (
      <div>
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.caption || `Immagine ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8"
                      onClick={() => handleImageDelete(category, idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm truncate">{image.caption || `Immagine ${idx + 1}`}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">Nessuna immagine</h3>
            <p className="text-gray-500">Carica delle immagini per la tua galleria</p>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Button onClick={() => handleImageUpload(category)}>
            <Upload className="mr-2 h-4 w-4" />
            Carica immagine
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-poppins font-semibold text-lg flex items-center">
          <Image className="mr-2 h-5 w-5 text-green-600" />
          Galleria Fotografica
        </h2>
        
        <Button size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Nuova categoria</span>
        </Button>
      </div>
      
      <Tabs defaultValue="environment" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="environment">Ambienti</TabsTrigger>
          <TabsTrigger value="dishes">Piatti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="environment">
          <ImageGallery images={galleryImages.environment} category="environment" />
        </TabsContent>
        
        <TabsContent value="dishes">
          <ImageGallery images={galleryImages.dishes} category="dishes" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantGallery;
