
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoIcon, Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

const RestaurantVideos = () => {
  // Mock videos data
  const [videos, setVideos] = useState([
    {
      id: '1',
      title: 'Come preparare la pasta senza glutine',
      description: 'Tutti i segreti per una pasta senza glutine perfetta.',
      thumbnailUrl: '/placeholder.svg',
      videoUrl: 'https://example.com/video1.mp4',
    },
    {
      id: '2',
      title: 'Pizza senza glutine fatta in casa',
      description: 'Ricetta per una pizza croccante e gustosa completamente gluten-free.',
      thumbnailUrl: '/placeholder.svg',
      videoUrl: 'https://example.com/video2.mp4',
    },
    {
      id: '3',
      title: 'Dolci senza glutine per ogni occasione',
      description: 'Tre ricette facili per dolci deliziosi e sicuri per i celiaci.',
      thumbnailUrl: '/placeholder.svg',
      videoUrl: 'https://example.com/video3.mp4',
    }
  ]);

  const handleAddVideo = () => {
    toast.info('Funzionalità di caricamento video in arrivo');
  };

  const handleEditVideo = (id: string) => {
    toast.info(`Modifica video ${id}`);
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
    toast.success('Video eliminato con successo');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Video Ricette</h1>
        <Button onClick={handleAddVideo} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Carica Nuovo</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoIcon size={48} className="text-white opacity-80" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{video.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">{video.description}</p>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditVideo(video.id)}
                  className="flex items-center gap-1"
                >
                  <Edit size={14} />
                  <span>Modifica</span>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteVideo(video.id)}
                  className="flex items-center gap-1"
                >
                  <Trash size={14} />
                  <span>Elimina</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 transition-colors aspect-video"
          onClick={handleAddVideo}
        >
          <VideoIcon className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Aggiungi una nuova video ricetta</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantVideos;
