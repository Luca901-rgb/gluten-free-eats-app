
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Phone, Calendar, Star, Award, Image, Home, Copy, Check, Menu, VideoIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StarRating from '@/components/common/StarRating';
import BookingForm from '../Booking/BookingForm';
import MenuViewer from './MenuViewer';
import ReviewForm from './ReviewForm';
import { toast } from 'sonner';
import VideoPlayer from '@/components/Video/VideoPlayer';

export interface RestaurantDetailProps {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  address: string;
  phone: string;
  openingHours: {
    days: string;
    hours: string;
  }[];
  rating: number;
  reviews: number;
  awards?: string[];
  menuUrl?: string;
  hasGlutenFreeOptions: boolean;
}

interface RestaurantDetailsProps {
  restaurant: RestaurantDetailProps;
  initialBookingCode?: string;
  initialRestaurantCode?: string;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ 
  restaurant, 
  initialBookingCode = '', 
  initialRestaurantCode = '' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get('tab');
  const bookingCodeFromUrl = searchParams.get('bookingCode');
  const restaurantCodeFromUrl = searchParams.get('restaurantCode');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'home');
  const [copyIcon, setCopyIcon] = useState<'copy' | 'check'>('copy');
  const [bookingCode, setBookingCode] = useState<string>(initialBookingCode || bookingCodeFromUrl || '');
  const [restaurantCode, setRestaurantCode] = useState<string>(initialRestaurantCode || restaurantCodeFromUrl || '');
  
  // Videos data - in a real app this would be fetched from API
  const [videos] = useState([
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
    }
  ]);
  
  const [selectedVideo, setSelectedVideo] = useState<{
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
  } | null>(null);
  
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (bookingCodeFromUrl) {
      setBookingCode(bookingCodeFromUrl);
    }
    if (restaurantCodeFromUrl) {
      setRestaurantCode(restaurantCodeFromUrl);
    }
  }, [bookingCodeFromUrl, restaurantCodeFromUrl]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopyIcon('check');
        toast.success('Codice copiato negli appunti');
        setTimeout(() => setCopyIcon('copy'), 2000);
      })
      .catch(err => {
        console.error('Errore durante la copia: ', err);
        toast.error('Impossibile copiare il codice');
      });
  };
  
  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId === 'reviews' && (bookingCode || restaurantCode)) {
      const params = new URLSearchParams();
      params.set('tab', 'reviews');
      if (bookingCode) params.set('bookingCode', bookingCode);
      if (restaurantCode) params.set('restaurantCode', restaurantCode);
      
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };
  
  const navigationButtons = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'menu', label: 'Menu', icon: <Menu size={18} /> },
    { id: 'gallery', label: 'Galleria', icon: <Image size={18} /> },
    { id: 'videos', label: 'Videoricette', icon: <VideoIcon size={18} /> },
    { id: 'booking', label: 'Prenotazioni', icon: <Calendar size={18} /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star size={18} /> },
  ];

  const handleBookingComplete = (newBookingCode: string, newRestaurantCode: string) => {
    setBookingCode(newBookingCode);
    setRestaurantCode(newRestaurantCode);
    navigateToTab('reviews');
  };
  
  const handlePlayVideo = (video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
  }) => {
    setSelectedVideo(video);
  };
  
  return (
    <div className="pb-20">
      <div className="relative h-56 md:h-72">
        <img 
          src={restaurant.coverImage} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <div className="text-white">
            <h1 className="font-poppins font-bold text-2xl mb-1">{restaurant.name}</h1>
            <div className="flex items-center mb-1">
              <StarRating rating={restaurant.rating} className="mr-2" />
              <span className="text-sm">{restaurant.reviews} recensioni</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin size={14} className="mr-1" />
              <span>{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {navigationButtons.map((button) => (
            <Button
              key={button.id}
              variant={activeTab === button.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigateToTab(button.id)}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              {button.icon}
              <span>{button.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-poppins font-semibold text-lg mb-2">Informazioni</h2>
              <p className="text-gray-700">{restaurant.description}</p>
            </div>
            
            <div>
              <h2 className="font-poppins font-semibold text-lg mb-2">Orari di apertura</h2>
              <div className="space-y-2">
                {restaurant.openingHours.map((time, index) => (
                  <div key={index} className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-700 mr-2 w-24">{time.days}:</span>
                    <span className="text-gray-700">{time.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="font-poppins font-semibold text-lg mb-2">Contatti</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-700">{restaurant.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <a href={`tel:${restaurant.phone}`} className="text-accent">{restaurant.phone}</a>
                </div>
              </div>
            </div>

            {restaurant.awards && restaurant.awards.length > 0 && (
              <div>
                <h2 className="font-poppins font-semibold text-lg mb-2">Riconoscimenti</h2>
                <div className="space-y-2">
                  {restaurant.awards.map((award, index) => (
                    <div key={index} className="flex items-center">
                      <Award size={16} className="mr-2 text-yellow-500" />
                      <span className="text-gray-700">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setActiveTab('booking')}>
                <Calendar size={18} className="mr-2" /> Prenota un tavolo
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-fade-in">
            <MenuViewer />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-poppins font-semibold text-lg">Galleria Fotografica</h2>
            <div className="grid grid-cols-2 gap-2">
              {restaurant.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img src={image} alt={`${restaurant.name} - Foto ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-poppins font-semibold text-lg">Videoricette</h2>
            
            {selectedVideo ? (
              <div className="space-y-4">
                <VideoPlayer 
                  videoUrl={selectedVideo.videoUrl}
                  thumbnail={selectedVideo.thumbnailUrl}
                  title={selectedVideo.title}
                  autoPlay={true}
                />
                <div className="mt-4">
                  <h3 className="font-medium text-lg">{selectedVideo.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedVideo.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedVideo(null)}
                    className="mt-4"
                  >
                    Torna alla lista
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div 
                    key={video.id} 
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <div className="relative aspect-video bg-gray-100">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity">
                          <VideoIcon size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="animate-fade-in">
            <BookingForm 
              restaurantId={restaurant.id} 
              restaurantName={restaurant.name} 
              restaurantImage={restaurant.coverImage}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-poppins font-semibold text-lg">Recensioni</h2>
              <span className="text-sm bg-primary/10 text-primary py-1 px-3 rounded-full">
                {restaurant.reviews} recensioni
              </span>
            </div>
            
            {(bookingCode || restaurantCode) && (
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <div className="flex flex-col">
                  {bookingCode && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Codice prenotazione:</span>
                      <span className="ml-2 font-mono text-sm">{bookingCode}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-1" 
                        onClick={() => handleCopy(bookingCode)}
                      >
                        {copyIcon === 'copy' ? <Copy size={12} /> : <Check size={12} className="text-green-500" />}
                      </Button>
                    </div>
                  )}
                  {restaurantCode && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Codice ristorante:</span>
                      <span className="ml-2 font-mono text-sm">{restaurantCode}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-1" 
                        onClick={() => handleCopy(restaurantCode)}
                      >
                        {copyIcon === 'copy' ? <Copy size={12} /> : <Check size={12} className="text-green-500" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <ReviewForm 
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              bookingCode={bookingCode}
              restaurantCode={restaurantCode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
