
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Restaurant } from '@/types/restaurant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Phone, Star, CalendarCheck, FileText, Video, Image } from 'lucide-react';
import VideoPlayer from '@/components/Video/VideoPlayer';
import BookingSystem from './BookingSystem';

export interface RestaurantDetailProps extends Restaurant {
  images?: string[];
  awards?: string[];
  menuUrl?: string;
}

interface RestaurantDetailsProps {
  restaurant: RestaurantDetailProps;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'info';
  const bookingCode = searchParams.get('bookingCode');
  const restaurantCode = searchParams.get('restaurantCode');

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/restaurant/${restaurant.id}?tab=${value}`, { replace: true });
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-80 rounded-b-lg overflow-hidden mb-6">
        <img
          src={restaurant.coverImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
          <div className="flex items-center text-white">
            <Star className="fill-yellow-400 text-yellow-400 w-5 h-5 mr-1" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="mx-1">·</span>
            <span>{restaurant.reviews} recensioni</span>
            {restaurant.hasGlutenFreeOptions && (
              <>
                <span className="mx-1">·</span>
                <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">100% Gluten Free</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="info">Informazioni</TabsTrigger>
          <TabsTrigger value="book">Prenota</TabsTrigger>
          <TabsTrigger value="gallery">Galleria</TabsTrigger>
          <TabsTrigger value="reviews">Recensioni</TabsTrigger>
        </TabsList>
        
        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-3">Descrizione</h2>
              <p className="text-gray-700">{restaurant.description}</p>

              {restaurant.awards && restaurant.awards.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Riconoscimenti:</h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.awards.map((award, index) => (
                      <span 
                        key={index} 
                        className="bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full border border-amber-200"
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address */}
            <Card>
              <CardContent className="flex items-start p-4">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Indirizzo</h3>
                  <p className="text-gray-700">{restaurant.address}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-sm mt-2 block hover:underline"
                  >
                    Apri in Google Maps
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="flex items-start p-4">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Contatti</h3>
                  <p className="text-gray-700">{restaurant.phone}</p>
                  <a 
                    href={`tel:${restaurant.phone}`} 
                    className="text-primary text-sm mt-2 block hover:underline"
                  >
                    Chiama ora
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="md:col-span-2">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-2">Orari di Apertura</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      {restaurant.openingHours?.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm py-1">
                          <span className="font-medium">{item.days}</span>
                          <span className="text-gray-700">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Menu */}
            {restaurant.menuUrl && (
              <Card className="md:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-2">Menu</h3>
                      <a 
                        href={restaurant.menuUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visualizza il menù completo
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Booking Tab */}
        <TabsContent value="book">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <CalendarCheck className="mr-2 text-primary" />
              Prenotazione Tavolo
            </h2>
            <BookingSystem 
              restaurantId={restaurant.id} 
              restaurantName={restaurant.name}
              restaurantImage={restaurant.image}
            />
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Image className="mr-2 text-primary" size={20} />
                  Galleria Immagini
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(restaurant.images || [restaurant.image]).map((img, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={img} 
                        alt={`${restaurant.name} - Immagine ${index + 1}`} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Video className="mr-2 text-primary" size={20} />
                  Video Presentazione
                </h2>
                <VideoPlayer 
                  videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  thumbnail={restaurant.image}
                  title={`Presentazione di ${restaurant.name}`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">Recensioni</h2>
                <button 
                  className="text-primary hover:underline font-medium text-sm"
                  onClick={() => navigate(`/restaurant/${restaurant.id}/reviews${bookingCode && restaurantCode ? `?bookingCode=${bookingCode}&restaurantCode=${restaurantCode}` : ''}`)}
                >
                  Scrivi una recensione
                </button>
              </div>

              {restaurant.reviews > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
                      <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
                      <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
                      <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
                      <Star className="fill-yellow-400 text-yellow-400 w-5 h-5 opacity-40" />
                    </div>
                    <div>
                      <span className="font-bold text-lg">{restaurant.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({restaurant.reviews} recensioni)
                      </span>
                    </div>
                  </div>
                  
                  {/* Placeholder for reviews */}
                  <div className="space-y-4">
                    <p className="text-gray-600 italic">
                      Clicca su "Scrivi una recensione" per leggere e aggiungere recensioni.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Ancora nessuna recensione per questo ristorante.</p>
                  <p className="text-sm">Sii il primo a condividere la tua esperienza!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantDetails;
