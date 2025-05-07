
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Plus, Trash2, Edit, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';

// Video di esempio
const sampleVideos = [
  {
    title: "Pasta alla Carbonara",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg",
    description: "La ricetta originale della pasta alla carbonara romana"
  },
  {
    title: "Tiramisù fatto in casa",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg",
    description: "Ricetta del tiramisù classico italiano"
  }
];

interface RestaurantVideosProps {
  isRestaurantOwner?: boolean;
}

const RestaurantVideos = ({ isRestaurantOwner = false }: RestaurantVideosProps) => {
  const [videos, setVideos] = useState(sampleVideos);
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    url: string;
    description?: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Carica i video dalla registrazione del ristorante se disponibili
  React.useEffect(() => {
    try {
      const registrationData = localStorage.getItem('restaurantRegistrationData');
      if (registrationData) {
        const parsed = JSON.parse(registrationData);
        if (parsed.media?.videos && Array.isArray(parsed.media.videos) && parsed.media.videos.length > 0) {
          setVideos(parsed.media.videos);
        }
      }
    } catch (error) {
      console.error("Errore nel caricamento dei video:", error);
    }
  }, []);
  
  const handleAddVideo = () => {
    // In un'implementazione reale, qui gestiremmo l'aggiunta di un nuovo video
    toast.info("Funzionalità di aggiunta video in sviluppo");
    
    // Per ora aggiungiamo un video di esempio
    setVideos(prev => [...prev, {
      title: "Nuovo video",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "/placeholder.svg",
      description: "Descrizione del nuovo video"
    }]);
  };
  
  const handleDeleteVideo = (index: number) => {
    setVideos(prev => prev.filter((_, idx) => idx !== index));
    toast.success("Video rimosso");
  };
  
  const handlePlayVideo = (video: typeof videos[0]) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-poppins font-semibold text-lg flex items-center">
          <Video className="mr-2 h-5 w-5 text-green-600" />
          Videoricette
        </h2>
        
        {isRestaurantOwner && (
          <Button size="sm" className="flex items-center gap-1" onClick={handleAddVideo}>
            <Plus className="h-4 w-4" />
            <span>Aggiungi Video</span>
          </Button>
        )}
      </div>
      
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div 
                className="relative aspect-video bg-gray-100 cursor-pointer"
                onClick={() => handlePlayVideo(video)}
              >
                <img 
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                {isRestaurantOwner && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(idx);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium truncate">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Nessun video</h3>
          <p className="text-gray-500">Non sono presenti videoricette</p>
          
          {isRestaurantOwner && (
            <Button className="mt-4" onClick={handleAddVideo}>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi il primo video
            </Button>
          )}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogHeader className="p-4">
            <DialogTitle>{selectedVideo?.title || 'Video'}</DialogTitle>
            <DialogDescription>
              {selectedVideo?.description || 'Guarda la videoricetta'}
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantVideos;
