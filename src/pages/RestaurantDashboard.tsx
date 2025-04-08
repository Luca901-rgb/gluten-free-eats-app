
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, MessageCircle, Settings, CalendarRange, Clock, MapPin, Phone, Mail, Globe, VideoIcon } from 'lucide-react';
import RestaurantBookings from './restaurant/RestaurantBookings';
import RestaurantReviews from './restaurant/RestaurantReviews';
import RestaurantGallery from './restaurant/RestaurantGallery';
import RestaurantProfile from './restaurant/RestaurantProfile';
import RestaurantVideos from './restaurant/RestaurantVideos';
import MenuViewer from '@/components/Restaurant/MenuViewer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Restaurant data
  const restaurantData = {
    name: 'La Trattoria Senza Glutine',
    description: 'Ristorante 100% gluten free specializzato in cucina italiana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
    address: 'Via Roma 123, Milano',
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
    totalReviews: 124,
  };

  return (
    <Layout hideNavigation>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-primary">{restaurantData.name}</h1>
            <p className="text-gray-600">{restaurantData.address}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                  <TabsList className="flex w-full h-auto p-1 bg-transparent mb-4">
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="overview" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Informazioni
                      </TabsTrigger>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="menu" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Menu
                      </TabsTrigger>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="videos" className="flex items-center">
                        <VideoIcon className="mr-2 h-4 w-4" />
                        Video Ricette
                      </TabsTrigger>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="gallery" className="flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        Galleria
                      </TabsTrigger>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="bookings" className="flex items-center">
                        <CalendarRange className="mr-2 h-4 w-4" />
                        Prenotazioni
                      </TabsTrigger>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="reviews" className="flex items-center">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Recensioni
                      </TabsTrigger>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto min-w-fit">
                      <TabsTrigger value="profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Profilo
                      </TabsTrigger>
                    </CarouselItem>
                  </TabsList>
                </CarouselContent>
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 transform" />
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 transform" />
              </Carousel>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni Ristorante</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Descrizione</h3>
                    <p className="text-gray-700">{restaurantData.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Orari di apertura</h3>
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
                    <h3 className="font-medium text-lg mb-2">Contatti</h3>
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="menu">
              <MenuViewer isRestaurantOwner={true} />
            </TabsContent>
            
            <TabsContent value="videos">
              <RestaurantVideos />
            </TabsContent>
            
            <TabsContent value="gallery">
              <RestaurantGallery />
            </TabsContent>
            
            <TabsContent value="bookings">
              <RestaurantBookings />
            </TabsContent>
            
            <TabsContent value="reviews">
              <RestaurantReviews />
            </TabsContent>
            
            <TabsContent value="profile">
              <RestaurantProfile />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
