
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MapPin, Store, Calendar, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRestaurantList } from '@/hooks/useRestaurantList';

const RestaurantHomePage = () => {
  const navigate = useNavigate();
  const [userRestaurant, setUserRestaurant] = useState(null);
  const { restaurants, isLoading } = useRestaurantList();
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);

  useEffect(() => {
    // Verifica autenticazione
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast.error("Accesso richiesto");
        navigate('/restaurant-login');
      }
      
      // In una versione reale, qui recupereremmo i dati del ristorante dell'utente
      // Per ora, usiamo dati di esempio
      setUserRestaurant({
        id: "1",
        name: "Keccakè",
        address: "Via Toledo 42, Napoli",
        imageUrl: "/placeholder.svg"
      });
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      // Filtra i ristoranti nelle vicinanze (escludendo il proprio)
      setNearbyRestaurants(restaurants.slice(0, 5));
    }
  }, [restaurants]);

  const handleManageRestaurant = () => {
    navigate('/restaurant-dashboard');
  };

  const handleViewRestaurant = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <Layout hideNavigation={true}>
      {/* Header */}
      <div className="bg-green-500 text-white p-4">
        <h1 className="text-xl font-bold">Benvenuto, Ristoratore</h1>
        <p className="text-sm opacity-90">Gestisci il tuo ristorante e monitora le attività</p>
      </div>
      
      {/* Il mio ristorante */}
      {userRestaurant && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">Il mio ristorante</h2>
          <Card className="bg-white shadow hover:shadow-md transition-shadow cursor-pointer" onClick={handleManageRestaurant}>
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="w-1/3">
                  <img 
                    src={userRestaurant.imageUrl} 
                    alt={userRestaurant.name} 
                    className="w-full h-24 object-cover" 
                  />
                </div>
                <div className="w-2/3 p-3">
                  <h3 className="font-bold">{userRestaurant.name}</h3>
                  <p className="text-sm text-gray-500">{userRestaurant.address}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Gestisci
                    </span>
                    <ArrowRight size={16} className="ml-1 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 h-16"
              onClick={() => navigate('/restaurant-dashboard')}
            >
              <Store className="h-5 w-5 text-green-600" />
              <span className="text-sm">Gestione Ristorante</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 h-16"
              onClick={() => navigate('/restaurant-dashboard')}
            >
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="text-sm">Prenotazioni</span>
            </Button>
          </div>
        </div>
      )}

      {/* Ristoranti nelle vicinanze */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Ristoranti nelle vicinanze</h2>
          <button className="text-sm text-green-600">Vedi tutti</button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyRestaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="bg-white hover:bg-gray-50" 
                onClick={() => handleViewRestaurant(restaurant.id)}
              >
                <CardContent className="p-3 flex items-center">
                  <div className="w-2/3">
                    <h3 className="font-medium">{restaurant.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {restaurant.address?.substring(0, 30)}...
                    </p>
                  </div>
                  <div className="w-1/3 flex justify-end">
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                      <Star size={12} className="text-yellow-500 mr-1" fill="currentColor" />
                      <span>{restaurant.rating || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantHomePage;
