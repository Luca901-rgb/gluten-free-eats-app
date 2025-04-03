
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Upload, Video, Trash2, Play } from 'lucide-react';

const RestaurantVideos = () => {
  // Mock video data
  const [videos, setVideos] = React.useState([
    { id: 1, thumbnail: '/placeholder.svg', title: 'Video Ricetta: Pasta Gluten Free', duration: '3:24' },
    { id: 2, thumbnail: '/placeholder.svg', title: 'Come preparare pizza senza glutine', duration: '5:12' },
    { id: 3, thumbnail: '/placeholder.svg', title: 'Dolci per celiaci', duration: '4:18' },
  ]);

  const handleAddVideo = () => {
    // In a real app, this would open a file picker or URL input
    alert('In a real app, this would open a file picker to upload videos');
    const newId = Math.max(...videos.map(video => video.id), 0) + 1;
    setVideos([...videos, {
      id: newId,
      thumbnail: '/placeholder.svg',
      title: `Nuovo Video ${newId}`,
      duration: '0:00'
    }]);
  };

  const handleDeleteVideo = (id: number) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Videoricette</h1>
          <Button onClick={handleAddVideo} className="flex items-center gap-2">
            <Upload size={16} />
            <span>Carica Nuovo Video</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-32 bg-gray-200 rounded-lg mb-4 md:mb-0 md:mr-4">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                    <Play size={24} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-lg">{video.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Pubblicato il {new Date().toLocaleDateString('it-IT')}</p>
                </div>
                
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Video size={16} className="mr-2" />
                    Modifica
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Elimina
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleAddVideo}
          >
            <Video className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Aggiungi video</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantVideos;
