
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoIcon, Plus, Edit, Trash, Link, File, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import VideoPlayer from '@/components/Video/VideoPlayer';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface RestaurantVideosProps {
  isRestaurantOwner?: boolean;
}

const RestaurantVideos: React.FC<RestaurantVideosProps> = ({ isRestaurantOwner = false }) => {
  // Mock videos data
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Come preparare la pasta senza glutine',
      description: 'Tutti i segreti per una pasta senza glutine perfetta.',
      thumbnailUrl: '/placeholder.svg',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    },
    {
      id: '2',
      title: 'Pizza senza glutine fatta in casa',
      description: 'Ricetta per una pizza croccante e gustosa completamente gluten-free.',
      thumbnailUrl: '/placeholder.svg',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    },
    {
      id: '3',
      title: 'Dolci senza glutine per ogni occasione',
      description: 'Tre ricette facili per dolci deliziosi e sicuri per i celiaci.',
      thumbnailUrl: '/placeholder.svg',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    }
  ]);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [videoInputMethod, setVideoInputMethod] = useState<'url' | 'file'>('url');
  
  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newThumbnail, setNewThumbnail] = useState<string>('/placeholder.svg');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleAddVideo = () => {
    setNewTitle('');
    setNewDescription('');
    setNewVideoUrl('');
    setNewThumbnail('/placeholder.svg');
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoInputMethod('url');
    setIsAddVideoOpen(true);
  };

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const handleEditVideo = (id: string) => {
    const video = videos.find(v => v.id === id);
    if (video) {
      setSelectedVideo(video);
      setNewTitle(video.title);
      setNewDescription(video.description);
      setNewVideoUrl(video.videoUrl);
      setNewThumbnail(video.thumbnailUrl);
      setVideoInputMethod(video.videoUrl.startsWith('blob:') ? 'file' : 'url');
      setIsAddVideoOpen(true);
    }
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
    toast.success('Video eliminato con successo');
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setNewVideoUrl(videoUrl);
      toast.success('Video caricato. Ricorda di salvare le modifiche.');
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const thumbnailUrl = URL.createObjectURL(file);
      setNewThumbnail(thumbnailUrl);
    }
  };

  const handleSaveVideo = () => {
    if (!newTitle.trim()) {
      toast.error('Inserisci un titolo per il video');
      return;
    }

    if (!newVideoUrl) {
      toast.error('Aggiungi un URL o carica un file video');
      return;
    }

    const newVideo: Video = {
      id: selectedVideo ? selectedVideo.id : Date.now().toString(),
      title: newTitle,
      description: newDescription,
      thumbnailUrl: newThumbnail,
      videoUrl: newVideoUrl,
    };

    if (selectedVideo) {
      // Update existing video
      setVideos(videos.map(video => video.id === selectedVideo.id ? newVideo : video));
      toast.success('Video aggiornato con successo');
    } else {
      // Add new video
      setVideos([...videos, newVideo]);
      toast.success('Nuovo video aggiunto');
    }

    setIsAddVideoOpen(false);
  };

  const handleBrowseVideoClick = () => {
    fileInputRef.current?.click();
  };

  const handleBrowseThumbnailClick = () => {
    thumbnailInputRef.current?.click();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Video Ricette</h1>
        {isRestaurantOwner && (
          <Button onClick={handleAddVideo} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Carica Nuovo</span>
          </Button>
        )}
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
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => handlePlayVideo(video)}
              >
                <div className="bg-primary rounded-full p-4 opacity-90 hover:opacity-100 transition-opacity">
                  <VideoIcon size={32} className="text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{video.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">{video.description}</p>
              
              {isRestaurantOwner && (
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
              )}
            </div>
          </Card>
        ))}

        {isRestaurantOwner && (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 transition-colors aspect-video"
            onClick={handleAddVideo}
          >
            <VideoIcon className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Aggiungi una nuova video ricetta</span>
          </div>
        )}
      </div>

      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
          <DialogContent className="sm:max-w-[800px] p-0">
            <DialogHeader className="p-4">
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <VideoPlayer 
                videoUrl={selectedVideo.videoUrl}
                thumbnail={selectedVideo.thumbnailUrl}
                title={selectedVideo.title}
                autoPlay={true}
                onError={(error) => {
                  console.error("Errore video:", error);
                  toast.error("Errore nella riproduzione del video");
                }}
              />
              <p className="mt-4 text-sm text-gray-600">
                {selectedVideo.description}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Video Dialog - Solo per proprietari ristorante */}
      {isRestaurantOwner && (
        <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedVideo ? 'Modifica Video' : 'Aggiungi Nuovo Video'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Titolo del video"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descrizione del video"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Video</Label>
                <div className="flex space-x-2 mb-2">
                  <Button
                    type="button"
                    variant={videoInputMethod === 'url' ? 'default' : 'outline'}
                    onClick={() => setVideoInputMethod('url')}
                    className="flex items-center gap-1"
                  >
                    <Link size={14} />
                    <span>URL</span>
                  </Button>
                  <Button
                    type="button"
                    variant={videoInputMethod === 'file' ? 'default' : 'outline'}
                    onClick={() => setVideoInputMethod('file')}
                    className="flex items-center gap-1"
                  >
                    <File size={14} />
                    <span>File</span>
                  </Button>
                </div>
                
                {videoInputMethod === 'url' ? (
                  <Input
                    id="videoUrl"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="Inserisci URL del video"
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Button 
                        type="button" 
                        onClick={handleBrowseVideoClick}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Upload size={14} />
                        <span>Seleziona file</span>
                      </Button>
                      {videoFile && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm truncate max-w-[150px]">{videoFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setVideoFile(null);
                              setNewVideoUrl('');
                            }}
                            className="h-6 w-6"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleVideoFileChange}
                      accept="video/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Miniatura</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={newThumbnail} 
                      alt="Miniatura" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBrowseThumbnailClick}
                      className="flex items-center gap-1"
                    >
                      <Upload size={14} />
                      <span>Carica immagine</span>
                    </Button>
                    <input
                      type="file"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Annulla</Button>
              </DialogClose>
              <Button onClick={handleSaveVideo}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RestaurantVideos;
