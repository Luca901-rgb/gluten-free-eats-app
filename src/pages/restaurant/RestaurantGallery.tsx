
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Upload, ImagePlus, Trash2 } from 'lucide-react';

const RestaurantGallery = () => {
  // Mock gallery data
  const [images, setImages] = React.useState([
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ]);

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    alert('In a real app, this would open a file picker to add images');
    // For demo purposes, we'll just add a new placeholder
    setImages([...images, '/placeholder.svg']);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Galleria Immagini</h1>
          <Button onClick={handleAddImage} className="flex items-center gap-2">
            <Upload size={16} />
            <span>Carica Nuova</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full aspect-square object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteImage(index)}
                  className="flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Elimina</span>
                </Button>
              </div>
            </div>
          ))}
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 transition-colors aspect-square"
            onClick={handleAddImage}
          >
            <ImagePlus className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Aggiungi immagine</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantGallery;
