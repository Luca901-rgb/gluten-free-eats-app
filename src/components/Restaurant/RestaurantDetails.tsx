
import React, { useState } from 'react';
import { MapPin, Menu, Image as ImageIcon, Calendar, Star, Home, Video, Wheat } from 'lucide-react';
import StarRating from '@/components/common/StarRating';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <div className="flex flex-col h-full bg-green-100/50 pb-20">
      {/* Restaurant Header with Image */}
      <div className="relative">
        <div className="bg-green-500 text-white p-3 flex items-center justify-center">
          <h1 className="text-lg font-bold flex items-center">
            <Wheat className="w-6 h-6 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        <div className="relative h-56">
          <img 
            src={restaurant.coverImage} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <h1 className="text-xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center mt-1">
              <StarRating rating={restaurant.rating} className="mr-2" />
              <span className="text-sm">{restaurant.reviews} recensioni</span>
            </div>
            <div className="flex items-center mt-1">
              <MapPin size={16} className="mr-1" />
              <span className="text-xs">{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-green-200/60 px-3 py-1">
        <div className="flex overflow-x-auto space-x-2 pb-1">
          <Button
            variant={activeTab === 'home' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1 whitespace-nowrap h-8 text-xs"
          >
            <Home size={14} />
            <span>Home</span>
          </Button>
          <Button
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-1 whitespace-nowrap h-8 text-xs"
          >
            <Menu size={14} />
            <span>Menu</span>
          </Button>
          <Button
            variant={activeTab === 'gallery' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('gallery')}
            className="flex items-center gap-1 whitespace-nowrap h-8 text-xs"
          >
            <ImageIcon size={14} />
            <span>Galleria</span>
          </Button>
          <Button
            variant={activeTab === 'videos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('videos')}
            className="flex items-center gap-1 whitespace-nowrap h-8 text-xs"
          >
            <Video size={14} />
            <span>Videoricette</span>
          </Button>
          <Button
            variant={activeTab === 'booking' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('booking')}
            className="flex items-center gap-1 whitespace-nowrap h-8 text-xs"
          >
            <Calendar size={14} />
            <span>Prenotazioni</span>
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('reviews')}
            className="flex items-center gap-1 whitespace-nowrap h-8 text-xs"
          >
            <Star size={14} />
            <span>Recensioni</span>
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Informazioni</h2>
            <p className="text-sm text-gray-700">{restaurant.description}</p>
            
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Orari di apertura</h3>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                {restaurant.openingHours.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.days}:</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Contatti</h3>
              <div className="bg-white p-3 rounded-lg shadow-sm text-sm">
                <p className="mb-1">{restaurant.address}</p>
                <p>Tel: {restaurant.phone}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'menu' && (
          <div className="text-center py-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">Menu</h2>
              <p className="text-sm text-gray-500 mb-4">Piatti 100% gluten free</p>
              
              {/* Sample menu */}
              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-md font-semibold border-b pb-1 mb-2">Antipasti</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bruschetta al pomodoro</span>
                      <span>€8.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Insalata caprese</span>
                      <span>€10.00</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold border-b pb-1 mb-2">Primi</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pasta alla carbonara</span>
                      <span>€12.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risotto ai funghi</span>
                      <span>€14.00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="mt-6" variant="outline" size="sm">
                Scarica menu completo
              </Button>
            </div>
          </div>
        )}
        
        {activeTab === 'gallery' && (
          <div className="py-4">
            <h2 className="text-lg font-bold mb-3">Galleria</h2>
            <div className="grid grid-cols-2 gap-2">
              {restaurant.images.map((img, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img} alt={`Gallery ${index+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div className="py-4">
            <h2 className="text-lg font-bold mb-3">Video ricette</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200">
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm">Pizza senza glutine</h3>
                  <p className="text-xs text-gray-500">Come preparare una pizza napoletana gluten free</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'booking' && (
          <div className="py-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-3">Prenota un tavolo</h2>
              <p className="text-sm text-gray-600 mb-4">Seleziona data e orario per prenotare da {restaurant.name}</p>
              
              <Button className="w-full">Prenota ora</Button>
              
              <p className="text-xs text-center text-gray-500 mt-4">Puoi cancellare gratuitamente fino a 24 ore prima</p>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="py-4">
            <h2 className="text-lg font-bold mb-3">Recensioni</h2>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                  <div>
                    <p className="font-medium text-sm">Mario R.</p>
                    <p className="text-xs text-gray-500">2 giorni fa</p>
                  </div>
                </div>
                <div>
                  <StarRating rating={5} size={14} />
                </div>
              </div>
              <p className="text-sm">Fantastico ristorante completamente gluten free. La pizza è buonissima e il personale molto cordiale!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
