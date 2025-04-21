
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, GalleryHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Main image gallery component
const RestaurantGallery = () => {
  // State for uploaded images (mockup)
  const [images, setImages] = useState<string[]>([]);
  // Modal state for viewing image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Simulate file input by adding a placeholder (replace with actual upload in production)
  const handleAddImage = () => {
    // In real implementation, open file picker and upload image here.
    setImages([...images, '/placeholder.svg']);
    toast.success("Immagine caricata (demo)");
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    toast.success("Immagine eliminata");
  };

  const openImageViewer = (image: string) => setSelectedImage(image);
  const closeImageViewer = () => setSelectedImage(null);

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-primary/10 rounded-full p-2 text-primary">
          <GalleryHorizontal size={28} className="text-primary" />
        </span>
        <h1 className="text-2xl font-poppins font-bold text-primary">Galleria Immagini</h1>
      </div>
      <div className="flex justify-end mb-2">
        <Button onClick={handleAddImage} className="flex items-center gap-2">
          <Upload size={16} />
          Carica Nuova
        </Button>
      </div>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group rounded-lg border overflow-hidden">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                onClick={() => openImageViewer(image)}
              />
              <div className="absolute inset-0 flex justify-center items-center bg-black/0 group-hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  className="z-10"
                  onClick={() => handleDeleteImage(index)}
                >
                  Elimina
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-secondary/20 rounded-lg">
          <GalleryHorizontal size={42} className="mb-3 text-primary" />
          <p className="text-gray-600 mb-3">Nessuna immagine nella galleria</p>
          <Button onClick={handleAddImage} className="flex items-center gap-2">
            <Upload size={16} />
            Carica la prima immagine
          </Button>
        </div>
      )}

      {/* Image Viewer Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={closeImageViewer}>
        <DialogContent className="max-w-2xl p-0 bg-transparent border-none">
          <div className="relative w-full flex items-center justify-center">
            <DialogClose className="absolute right-2 top-2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
              <X className="h-5 w-5" />
            </DialogClose>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantGallery;

