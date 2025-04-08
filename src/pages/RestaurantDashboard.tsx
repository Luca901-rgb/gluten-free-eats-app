import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, Image, MessageCircle, Settings, CalendarRange, 
  Clock, MapPin, Phone, Mail, Globe, VideoIcon, Home, 
  Menu, Star
} from 'lucide-react';
import RestaurantBookings from './restaurant/RestaurantBookings';
import RestaurantReviews from './restaurant/RestaurantReviews';
import RestaurantGallery from './restaurant/RestaurantGallery';
import RestaurantVideos from './restaurant/RestaurantVideos';
import MenuViewer from '@/components/Restaurant/MenuViewer';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Restaurant data
  const restaurantData = {
    name: 'La Trattoria Senza Glutine',
    description: 'Ristorante 100% gluten free specializzato in cucina italiana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
    address: 'Via Roma 123, Milano, 20100',
    phone: '+39 02 1234567',
    email: 'info@trattoriasenzaglutine.it',
    website: 'www.trattoriasenzaglutine.it',
    openingHours: [
      { days: 'Lunedì', hours: 'Chiuso' },
      { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
      { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
      { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
    ],
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  };

  // Determina se l'utente è il proprietario del ristorante
  // In un'applicazione reale, questo valore verrebbe determinato dall'autenticazione dell'utente
  const isRestaurantOwner = true;

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    
    // Find the selected button and scroll it into view
    if (tabsContainerRef.current) {
      const selectedButton = tabsContainerRef.current.querySelector(`[data-tab="${tabId}"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Rimuoviamo la tab del profilo dall'array di pulsanti di navigazione
  const navigationButtons = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'menu', label: 'Menu', icon: <Menu size={18} /> },
    { id: 'videos', label: 'Videoricette', icon: <VideoIcon size={18} /> },
    { id: 'gallery', label: 'Galleria', icon: <Image size={18} /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <CalendarRange size={18} /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star size={18} /> },
  ];

  return (
    <Layout hideNavigation>
      <div className="relative">
        {/* Cover image section */}
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

        {/* Navigation tabs with improved scrolling */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <div className="flex items-center px-4 py-3">
              <CarouselContent className="ml-0">
                {navigationButtons.map((button) => (
                  <CarouselItem key={button.id} className="basis-auto pl-0 mr-2 min-w-min">
                    <Button
                      variant={activeTab === button.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => navigateToTab(button.id)}
                      className="flex items-center gap-1 whitespace-nowrap"
                      data-tab={button.id}
                    >
                      {button.icon}
                      <span>{button.label}</span>
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
          </Carousel>
        </div>

        {/* Tab content */}
        <div className="px-4 py-4">
          {activeTab === 'home' && (
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
          )}

          {activeTab === 'menu' && (
            <div className="animate-fade-in">
              <MenuViewer isRestaurantOwner={isRestaurantOwner} />
            </div>
          )}
          
          {activeTab === 'videos' && (
            <div className="animate-fade-in">
              <RestaurantVideos isRestaurantOwner={isRestaurantOwner} />
            </div>
          )}
          
          {activeTab === 'gallery' && (
            <div className="animate-fade-in">
              <RestaurantGallery />
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div className="animate-fade-in">
              <RestaurantBookings />
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <RestaurantReviews />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
