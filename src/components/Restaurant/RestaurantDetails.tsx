
import React, { useState } from 'react';
import { MapPin, Menu, Image as ImageIcon, Calendar, Star, Home, Video } from 'lucide-react';
import StarRating from '@/components/common/StarRating';
import { Button } from '@/components/ui/button';

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
        <div className="bg-green-500 text-white p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold flex items-center">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        <div className="relative h-60">
          <img 
            src={restaurant.coverImage} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center mt-1">
              <StarRating rating={restaurant.rating} className="mr-2" />
              <span>{restaurant.reviews} recensioni</span>
            </div>
            <div className="flex items-center mt-1">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-green-200/60 px-4 py-2">
        <div className="flex overflow-x-auto space-x-2 pb-1">
          <Button
            variant={activeTab === 'home' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1 whitespace-nowrap bg-blue-700"
          >
            <Home size={16} />
            <span>Home</span>
          </Button>
          <Button
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Menu size={16} />
            <span>Menu</span>
          </Button>
          <Button
            variant={activeTab === 'gallery' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('gallery')}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <ImageIcon size={16} />
            <span>Galleria</span>
          </Button>
          <Button
            variant={activeTab === 'videos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('videos')}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Video size={16} />
            <span>Videoricette</span>
          </Button>
          <Button
            variant={activeTab === 'booking' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('booking')}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Calendar size={16} />
            <span>Prenotazioni</span>
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('reviews')}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Star size={16} />
            <span>Recensioni</span>
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Informazioni</h2>
            <p className="text-gray-700">{restaurant.description}</p>
          </div>
        )}
        
        {activeTab === 'menu' && (
          <div className="text-center py-10">
            <p>Contenuto del menu</p>
          </div>
        )}
        
        {activeTab === 'gallery' && (
          <div className="text-center py-10">
            <p>Galleria di immagini</p>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div className="text-center py-10">
            <p>Video ricette</p>
          </div>
        )}
        
        {activeTab === 'booking' && (
          <div className="text-center py-10">
            <p>Prenotazioni</p>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="text-center py-10">
            <p>Recensioni</p>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-500 flex justify-around items-center py-2 text-white">
        <button className="flex flex-col items-center px-4">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <Menu size={20} />
          <span className="text-xs mt-1">Menu</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <ImageIcon size={20} />
          <span className="text-xs mt-1">Galleria</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <Calendar size={20} />
          <span className="text-xs mt-1">Prenotazioni</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <Star size={20} />
          <span className="text-xs mt-1">Recensioni</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantDetails;
