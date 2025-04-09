
import React from 'react';
import { Clock, MapPin, Phone, Mail, Globe } from 'lucide-react';

interface RestaurantInfoProps {
  restaurantData: {
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    openingHours: Array<{
      days: string;
      hours: string;
    }>;
  };
}

const RestaurantInfo = ({ restaurantData }: RestaurantInfoProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-poppins font-semibold text-lg mb-2">Informazioni</h2>
        <p className="text-gray-700">{restaurantData.description}</p>
      </div>
      
      <div>
        <h2 className="font-poppins font-semibold text-lg mb-2">Orari di apertura</h2>
        <div className="space-y-2">
          {restaurantData.openingHours.map((time, index) => (
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
            <span className="text-gray-700">{restaurantData.address}</span>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{restaurantData.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{restaurantData.email}</span>
          </div>
          <div className="flex items-center">
            <Globe size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700">{restaurantData.website}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
