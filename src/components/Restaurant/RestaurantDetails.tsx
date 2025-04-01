
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Phone, Calendar, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '@/components/common/StarRating';
import BookingForm from '../Booking/BookingForm';
import MenuViewer from './MenuViewer';
import ReviewForm from './ReviewForm';

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

const RestaurantDetails: React.FC<{ restaurant: RestaurantDetailProps }> = ({ restaurant }) => {
  const [activeTab, setActiveTab] = useState('info');
  
  // Sample review data for demo
  const sampleReview = {
    bookingCode: 'TRA123',
    restaurantCode: 'RES456',
  };
  
  return (
    <div className="pb-20">
      {/* Restaurant Cover Image */}
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

      {/* Restaurant Tabs */}
      <div className="px-4 mt-4">
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="booking">Prenota</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="animate-fade-in">
            <div className="space-y-6">
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
          </TabsContent>

          <TabsContent value="menu" className="animate-fade-in">
            <MenuViewer />
          </TabsContent>

          <TabsContent value="booking" className="animate-fade-in">
            <BookingForm 
              restaurantId={restaurant.id} 
              restaurantName={restaurant.name} 
              restaurantImage={restaurant.coverImage}
            />
          </TabsContent>

          <TabsContent value="reviews" className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-poppins font-semibold text-lg">Recensioni</h2>
                <span className="text-sm bg-primary/10 text-primary py-1 px-3 rounded-full">
                  {restaurant.reviews} recensioni
                </span>
              </div>
              
              {/* Sample review form for demo */}
              <ReviewForm 
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                bookingCode={sampleReview.bookingCode}
                restaurantCode={sampleReview.restaurantCode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetails;
