
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Video, Download, Play, Clock, Heart, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface VideoRecipe {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  restaurant: {
    id: string;
    name: string;
  };
  isFavorite: boolean;
  hasPdf: boolean;
}

// Sample data - would come from API
const sampleVideos: VideoRecipe[] = [
  {
    id: '1',
    title: 'Pizza Senza Glutine Fatta in Casa',
    description: 'Impara a preparare una deliziosa pizza senza glutine con questo tutorial passo-passo del nostro chef. Scoprirai tutti i segreti per un impasto perfetto e croccante!',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://example.com/video1.mp4',
    duration: '12:45',
    restaurant: {
      id: '2',
      name: 'Pizzeria Gluten Free'
    },
    isFavorite: true,
    hasPdf: true
  },
  {
    id: '2',
    title: 'Pasta Fresca Senza Glutine',
    description: 'La pasta fresca fatta in casa è possibile anche senza glutine! In questo video imparerai a preparare tagliatelle, fettuccine e ravioli.',
    thumbnail: 'https://images.unsplash.com/photo-1603729362760-408f86a48177?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://example.com/video2.mp4',
    duration: '18:20',
    restaurant: {
      id: '3',
      name: 'Pasta & Risotti'
    },
    isFavorite: false,
    hasPdf: true
  },
  {
    id: '3',
    title: 'Dolci Senza Glutine per Occasioni Speciali',
    description: 'I dolci sono spesso i più difficili da preparare senza glutine, ma con questi consigli potrai creare dessert incredibili per ogni occasione.',
    thumbnail: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://example.com/video3.mp4',
    duration: '15:10',
    restaurant: {
      id: '1',
      name: 'La Trattoria Senza Glutine'
    },
    isFavorite: false,
    hasPdf: false
  },
  {
    id: '4',
    title: 'Pane Senza Glutine: Trucchi e Consigli',
    description: 'Il pane senza glutine può essere incredibilmente gustoso! Il nostro chef ti guiderà passo-passo alla preparazione di varie tipologie di pane.',
    thumbnail: 'https://images.unsplash.com/photo-1586444248879-9a421644b5b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://example.com/video4.mp4',
    duration: '22:30',
    restaurant: {
      id: '4',
      name: 'La Celiachia'
    },
    isFavorite: true,
    hasPdf: true
  }
];

const VideoRecipesPage = () => {
  const [videos, setVideos] = useState<VideoRecipe[]>(sampleVideos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoRecipe | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm) {
      setVideos(sampleVideos);
      return;
    }
    
    const filtered = sampleVideos.filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setVideos(filtered);
  };

  const handleToggleFavorite = (id: string) => {
    setVideos(videos.map(video => 
      video.id === id 
        ? { ...video, isFavorite: !video.isFavorite } 
        : video
    ));
    
    const video = videos.find(v => v.id === id);
    if (video) {
      toast.success(video.isFavorite 
        ? `"${video.title}" rimosso dai preferiti` 
        : `"${video.title}" aggiunto ai preferiti`
      );
    }
  };

  const handlePlayVideo = (video: VideoRecipe) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    // In a real app, this would actually play the video
  };

  const handleDownloadRecipe = (video: VideoRecipe) => {
    toast.success(`Download ricetta "${video.title}" iniziato`);
    // In a real app, this would initiate a PDF download
  };

  const VideoPlayer = ({ video }: { video: VideoRecipe }) => (
    <div className="space-y-4">
      <div className="aspect-video rounded-lg overflow-hidden bg-black relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-center px-4">
            In una vera app, qui ci sarebbe un player video. Per ora visualizziamo solo l'anteprima.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600 gap-4">
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            {video.duration}
          </span>
          <span>Da {video.restaurant.name}</span>
        </div>
        <p className="text-gray-700">{video.description}</p>
      </div>
      
      <div className="flex gap-2">
        {video.hasPdf && (
          <Button variant="outline" onClick={() => handleDownloadRecipe(video)}>
            <Download size={16} className="mr-2" />
            Scarica ricetta in PDF
          </Button>
        )}
        <Button 
          variant={video.isFavorite ? "secondary" : "outline"} 
          onClick={() => handleToggleFavorite(video.id)}
        >
          <Heart size={16} className={`mr-2 ${video.isFavorite ? 'fill-primary' : ''}`} />
          {video.isFavorite ? 'Salvato' : 'Salva video'}
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-poppins font-bold text-primary">Videoricette</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Cerca videoricette..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search size={16} className="mr-2" />
            Cerca
          </Button>
        </form>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map(video => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => handlePlayVideo(video)}
                      variant="secondary"
                      className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                    >
                      <Play size={20} />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/60">
                    <Clock size={12} className="mr-1" />
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{video.restaurant.name}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{video.description}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handlePlayVideo(video)}>
                    <Play size={16} className="mr-2" />
                    Guarda
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(video.id)}
                    className={video.isFavorite ? 'text-primary' : ''}
                  >
                    <Heart size={16} className={video.isFavorite ? 'fill-primary' : ''} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-secondary/20 rounded-lg p-8 text-center">
            <Video size={32} className="mx-auto mb-3 text-primary" />
            <p className="text-gray-700 mb-2">Nessuna videoricetta trovata</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setVideos(sampleVideos);
            }}>
              Mostra tutte le videoricette
            </Button>
          </div>
        )}
      </div>

      {selectedVideo && (
        <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
          <DialogContent className="sm:max-w-[800px] p-0">
            <DialogHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
              <div className="flex justify-between items-start">
                <DialogTitle>{selectedVideo.title}</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                    <X size={16} />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <div className="p-4 sm:p-6">
              <VideoPlayer video={selectedVideo} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default VideoRecipesPage;
