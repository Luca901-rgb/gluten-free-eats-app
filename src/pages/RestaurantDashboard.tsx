
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CalendarRange, Home, Image, MessageCircle, Settings, FileText, VideoIcon } from 'lucide-react';
import RestaurantBookings from './restaurant/RestaurantBookings';
import RestaurantReviews from './restaurant/RestaurantReviews';
import RestaurantGallery from './restaurant/RestaurantGallery';
import RestaurantProfile from './restaurant/RestaurantProfile';
import RestaurantVideos from './restaurant/RestaurantVideos';
import MenuViewer from '@/components/Restaurant/MenuViewer';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample restaurant data
  const restaurantData = {
    name: 'La Trattoria Senza Glutine',
    address: 'Via Roma 123, Milano',
    phone: '+39 02 1234567',
    email: 'info@trattoriasenzaglutine.it',
    rating: 4.7,
    totalReviews: 124,
    bookings: {
      today: 8,
      tomorrow: 12,
      thisWeek: 43,
      nextWeek: 37,
    },
    revenue: {
      today: 780,
      thisWeek: 4250,
      thisMonth: 18700,
    }
  };

  return (
    <Layout hideNavigation>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-primary">{restaurantData.name}</h1>
            <p className="text-gray-600">{restaurantData.address}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('profile')}>
            <Settings className="mr-2 h-4 w-4" />
            Impostazioni
          </Button>
        </div>
        
        <div className="mb-6">
          <ScrollArea className="w-full">
            <div className="min-w-full pr-4">
              <Tabs 
                defaultValue="overview" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex w-max mb-4 space-x-2 overflow-x-auto scrollbar-hide">
                  <TabsTrigger value="overview" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="flex items-center">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    Prenotazioni
                  </TabsTrigger>
                  <TabsTrigger value="menu" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Menu
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Recensioni
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="flex items-center">
                    <Image className="mr-2 h-4 w-4" />
                    Galleria
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex items-center">
                    <VideoIcon className="mr-2 h-4 w-4" />
                    Video Ricette
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    Statistiche
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profilo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Prenotazioni di oggi</CardTitle>
                        <CardDescription>Stato attuale</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{restaurantData.bookings.today}</div>
                        <p className="text-sm text-gray-500 mt-1">
                          {restaurantData.bookings.today > 5 ? 'Giornata piena' : 'Disponibilità residua'}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Valutazione</CardTitle>
                        <CardDescription>Media recensioni</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{restaurantData.rating}</div>
                        <p className="text-sm text-gray-500 mt-1">
                          Basato su {restaurantData.totalReviews} recensioni
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Incasso giornaliero</CardTitle>
                        <CardDescription>Stima attuale</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">€{restaurantData.revenue.today}</div>
                        <p className="text-sm text-gray-500 mt-1">
                          +12% rispetto alla media
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Prenotazioni settimanali</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                          [Grafico prenotazioni settimanali]
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Ricavi mensili</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                          [Grafico ricavi mensili]
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ultime recensioni</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start pb-4 border-b">
                            <div>
                              <h3 className="font-medium">Mario Rossi</h3>
                              <p className="text-sm text-gray-600 mt-1">Ottimo ristorante senza glutine, finalmente ho potuto gustare una pizza davvero buona senza preoccuparmi!</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-yellow-400">
                                ★★★★★
                              </div>
                              <p className="text-xs text-gray-500 mt-1">2 giorni fa</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Giulia Bianchi</h3>
                              <p className="text-sm text-gray-600 mt-1">Ambiente accogliente e personale molto attento alle esigenze dei celiaci. Menu vario e gustoso.</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-yellow-400">
                                ★★★★☆
                              </div>
                              <p className="text-xs text-gray-500 mt-1">5 giorni fa</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('reviews')}>
                          Vedi tutte le recensioni
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="bookings">
                  <RestaurantBookings />
                </TabsContent>
                
                <TabsContent value="menu">
                  <MenuViewer isRestaurantOwner={true} />
                </TabsContent>
                
                <TabsContent value="reviews">
                  <RestaurantReviews />
                </TabsContent>
                
                <TabsContent value="gallery">
                  <RestaurantGallery />
                </TabsContent>
                
                <TabsContent value="videos">
                  <RestaurantVideos />
                </TabsContent>
                
                <TabsContent value="profile">
                  <RestaurantProfile />
                </TabsContent>
                
                <TabsContent value="analytics">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="font-poppins font-semibold text-lg mb-6">Statistiche e Analisi</h2>
                    
                    <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                      <span className="text-gray-400">Grafici statistiche</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Visite al profilo</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,245</div>
                          <p className="text-xs text-green-600">+12% questa settimana</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Conversione prenotazioni</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">15.8%</div>
                          <p className="text-xs text-green-600">+2.3% rispetto al mese scorso</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Clienti fidelizzati</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">42%</div>
                          <p className="text-xs text-amber-600">-1% rispetto al mese scorso</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
