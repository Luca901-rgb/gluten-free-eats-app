
import React from 'react';
import { Clock, MapPin, Phone, Mail, Globe, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RestaurantInfoProps {
  restaurantData: {
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    openingHours?: Array<{
      days: string;
      hours: string;
    }>;
  };
}

const RestaurantInfo = ({ restaurantData }: RestaurantInfoProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-poppins font-semibold text-lg mb-4 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-green-600" />
            Informazioni sul ristorante
          </h2>
          <p className="text-gray-700 mb-6">
            {restaurantData.description || 
             "Benvenuti nel nostro ristorante. Siamo lieti di offrirvi un'esperienza culinaria unica con piatti della tradizione italiana e opzioni senza glutine. Vi aspettiamo!"}
          </p>
          
          <h3 className="font-medium text-md mb-3">Orari di apertura</h3>
          <div className="space-y-2 mb-6">
            {restaurantData.openingHours && restaurantData.openingHours.length > 0 ? (
              restaurantData.openingHours.map((time, index) => (
                <div key={index} className="flex items-center">
                  <Clock size={16} className="mr-2 text-green-600" />
                  <span className="text-gray-700 mr-2 w-32 font-medium">{time.days}:</span>
                  <span className="text-gray-700">{time.hours}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">Orari non disponibili</div>
            )}
          </div>
          
          <h3 className="font-medium text-md mb-3">Contatti</h3>
          <div className="space-y-3">
            {restaurantData.address && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-green-600" />
                <span className="text-gray-700">{restaurantData.address}</span>
              </div>
            )}
            
            {restaurantData.phone && (
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-green-600" />
                <span className="text-gray-700">{restaurantData.phone}</span>
              </div>
            )}
            
            {restaurantData.email && (
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-green-600" />
                <span className="text-gray-700">{restaurantData.email}</span>
              </div>
            )}
            
            {restaurantData.website && (
              <div className="flex items-center">
                <Globe size={16} className="mr-2 text-green-600" />
                <a 
                  href={restaurantData.website.startsWith('http') ? restaurantData.website : `https://${restaurantData.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-700 hover:underline"
                >
                  {restaurantData.website}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-poppins font-semibold text-lg mb-3">Servizi offerti</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">Senza glutine</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">Wi-Fi gratuito</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">Parcheggio</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">Prenotazioni</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantInfo;
