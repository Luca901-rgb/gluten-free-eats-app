
import React from 'react';
import { MapPin, Star } from 'lucide-react';

interface DashboardHeaderProps {
  restaurantData: {
    name: string;
    address: string;
    rating: number;
    totalReviews: number;
    coverImage: string;
  };
}

const DashboardHeader = ({ restaurantData }: DashboardHeaderProps) => {
  return (
    <div className="relative h-56 md:h-72">
      <img 
        src={restaurantData.coverImage} 
        alt={restaurantData.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
        <div className="text-white">
          <h1 className="font-poppins font-bold text-2xl mb-1">{restaurantData.name}</h1>
          <div className="flex items-center mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(restaurantData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm ml-2">{restaurantData.totalReviews} recensioni</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{restaurantData.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
