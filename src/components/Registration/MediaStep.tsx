
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, Image, Video, X, Plus } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MediaStep = () => {
  const { setValue, watch } = useFormContext();
  const coverImageRef = useRef<HTMLInputElement>(null);
  const environmentImageRef = useRef<HTMLInputElement>(null);
  const dishesImageRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("cover");
  
  const coverImage = watch('media.coverImage') || '/placeholder.svg';
  const environmentImages = watch('media.gallery.environment') || [];
  const dishesImages = watch('media.gallery.dishes') || [];
  const videos = watch('media.videos') || [];

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload to a server
    // For now, create a URL for preview
    const imageUrl = URL.createObjectURL(file);
    setValue('media.coverImage', imageUrl);
  };
  
  const handleEnvironmentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      caption: ''
    }));
    
    setValue('media.gallery.environment', [...environmentImages, ...newImages]);
  };
  
  const handleDishesImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      caption: ''
    }));
    
    setValue('media.gallery.dishes', [...dishesImages, ...newImages]);
  };

  const handleVideoAdd = () => {
    setValue('media.videos', [...videos, { title: '', url: '', thumbnail: '' }]);
  };
  
  const handleVideoChange = (index: number, field: string, value: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value
    };
    setValue('media.videos', updatedVideos);
  };
  
  const handleCaptionChange = (type: 'environment' | 'dishes', index: number, caption: string) => {
    const images = type === 'environment' ? [...environmentImages] : [...dishesImages];
    images[index].caption = caption;
    setValue(`media.gallery.${type}`, images);
  };
  
  const handleRemoveImage = (type: 'environment' | 'dishes', index: number) => {
    const images = type === 'environment' ? [...environmentImages] : [...dishesImages];
    images.splice(index, 1);
    setValue(`media.gallery.${type}`, images);
  };
  
  const handleRemoveVideo = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setValue('media.videos', updatedVideos);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contenuti Multimediali</h3>
        <p className="text-sm text-gray-500">
          Carica immagini e video per mostrare il tuo ristorante ai clienti.
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="cover">Immagine di Copertina</TabsTrigger>
          <TabsTrigger value="gallery">Galleria Fotografica</TabsTrigger>
          <TabsTrigger value="videos">VideoRicette</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cover" className="space-y-4">
          <div className="border rounded-md p-4 flex flex-col items-center">
            <div className="w-full h-60 rounded-md overflow-hidden mb-4">
              <img 
                src={coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            </div>
            <input 
              type="file" 
              ref={coverImageRef}
              accept="image/*" 
              className="hidden"
              onChange={handleCoverImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => coverImageRef.current?.click()}
              className="flex gap-2"
            >
              <Upload size={16} />
              <span>Carica immagine di copertina</span>
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Dimensioni consigliate: 1200x630px, formato .jpg/.png
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="gallery" className="space-y-4">
          <Tabs defaultValue="environment">
            <TabsList>
              <TabsTrigger value="environment">Ambiente</TabsTrigger>
              <TabsTrigger value="dishes">Piatti</TabsTrigger>
            </TabsList>
            
            <TabsContent value="environment" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {environmentImages.map((image, index) => (
                  <div key={index} className="border rounded-md p-2 space-y-2">
                    <div className="relative w-full h-40">
                      <img 
                        src={image.url} 
                        alt={image.caption || `Environment ${index+1}`} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => handleRemoveImage('environment', index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Didascalia immagine"
                      value={image.caption}
                      onChange={(e) => handleCaptionChange('environment', index, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ))}
                
                <div className="border border-dashed rounded-md flex items-center justify-center h-[168px]">
                  <input 
                    type="file" 
                    ref={environmentImageRef}
                    accept="image/*" 
                    multiple
                    className="hidden"
                    onChange={handleEnvironmentImageUpload}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => environmentImageRef.current?.click()}
                    className="flex flex-col gap-2 h-full w-full"
                  >
                    <Plus size={24} />
                    <span>Aggiungi foto</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="dishes" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dishesImages.map((image, index) => (
                  <div key={index} className="border rounded-md p-2 space-y-2">
                    <div className="relative w-full h-40">
                      <img 
                        src={image.url} 
                        alt={image.caption || `Dish ${index+1}`} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => handleRemoveImage('dishes', index)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Nome del piatto"
                      value={image.caption}
                      onChange={(e) => handleCaptionChange('dishes', index, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                ))}
                
                <div className="border border-dashed rounded-md flex items-center justify-center h-[168px]">
                  <input 
                    type="file" 
                    ref={dishesImageRef}
                    accept="image/*" 
                    multiple
                    className="hidden"
                    onChange={handleDishesImageUpload}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => dishesImageRef.current?.click()}
                    className="flex flex-col gap-2 h-full w-full"
                  >
                    <Plus size={24} />
                    <span>Aggiungi foto</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div key={index} className="border rounded-md p-4 space-y-3 relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-7 w-7"
                  onClick={() => handleRemoveVideo(index)}
                >
                  <X size={14} />
                </Button>
                <div className="space-y-2">
                  <Label htmlFor={`video-title-${index}`}>Titolo Video</Label>
                  <Input
                    id={`video-title-${index}`}
                    placeholder="Titolo della video ricetta"
                    value={video.title}
                    onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`video-url-${index}`}>URL Video</Label>
                  <Input
                    id={`video-url-${index}`}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={video.url}
                    onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Supportiamo link a YouTube, Vimeo o file MP4
                  </p>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleVideoAdd}
              className="w-full flex items-center justify-center gap-2"
            >
              <Video size={16} />
              <span>Aggiungi Video Ricetta</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaStep;
