
import React from 'react';
import RestaurantInfo from './RestaurantInfo';
import MenuViewer from './MenuViewer';
import TableManagement from './TableManagement';
import RestaurantVideos from '@/pages/restaurant/RestaurantVideos';
import RestaurantGallery from '@/pages/restaurant/RestaurantGallery';
import RestaurantBookings from '@/pages/restaurant/RestaurantBookings';
import RestaurantReviews from '@/pages/restaurant/RestaurantReviews';
import RestaurantOffers from '@/pages/restaurant/RestaurantOffers';
import RestaurantProfile from '@/pages/restaurant/RestaurantProfile';
import { useTab } from '@/context/TabContext';
import { Restaurant } from '@/types/restaurant';
import { useNavigate } from 'react-router-dom';
import { LogOut, Star, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import safeStorage from '@/lib/safeStorage';

interface DashboardContentProps {
  restaurantData: Restaurant | any;
  isRestaurantOwner: boolean;
}

const DashboardContent = ({ restaurantData, isRestaurantOwner }: DashboardContentProps) => {
  const { currentTab } = useTab();
  const navigate = useNavigate();
  
  console.log("DashboardContent: Rendering tab", currentTab, "isRestaurantOwner:", isRestaurantOwner);
  
  const handleLogout = () => {
    try {
      safeStorage.removeItem('isAuthenticated');
      safeStorage.removeItem('userType'); 
      safeStorage.removeItem('userEmail');
      safeStorage.removeItem('userId');
      safeStorage.removeItem('isRestaurantOwner');
      
      auth.signOut()
        .then(() => {
          toast.success("Logout effettuato con successo");
          navigate('/');
        })
        .catch(() => {
          navigate('/');
        });
    } catch {
      navigate('/');
    }
  };

  const stats = [
    { label: 'Prenotazioni', value: '152', icon: <Calendar className="h-5 w-5 text-blue-500" /> },
    { label: 'Recensioni', value: '42', icon: <Star className="h-5 w-5 text-yellow-500" /> },
    { label: 'Media voti', value: '4.7', icon: <Star className="h-5 w-5 text-green-500" /> },
    { label: 'Clienti abituali', value: '28', icon: <User className="h-5 w-5 text-purple-500" /> }
  ];
  
  return (
    <div className="px-4 py-4 pb-24">
      {currentTab === 'home' && <RestaurantInfo restaurantData={restaurantData} />}
      
      {currentTab === 'menu' && (
        <div className="animate-fade-in">
          <MenuViewer isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {/* La gestione tavoli è visibile solo ai ristoratori */}
      {currentTab === 'tables' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <TableManagement restaurantId={restaurantData.id || '1'} />
        </div>
      )}
      
      {currentTab === 'videos' && (
        <div className="animate-fade-in">
          <RestaurantVideos isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {currentTab === 'gallery' && (
        <div className="animate-fade-in">
          <RestaurantGallery />
        </div>
      )}
      
      {currentTab === 'bookings' && (
        <div className="animate-fade-in">
          <RestaurantBookings />
        </div>
      )}
      
      {currentTab === 'reviews' && (
        <div className="animate-fade-in">
          <RestaurantReviews />
        </div>
      )}
      
      {/* Sezione offerte */}
      {currentTab === 'offers' && (
        <div className="animate-fade-in">
          <RestaurantOffers isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {/* Sezioni specifiche per i ristoratori */}
      {currentTab === 'clients' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">Gestione Clienti</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-gray-600">Funzionalità in arrivo...</p>
          </div>
        </div>
      )}
      
      {currentTab === 'profile' && (
        <div className="animate-fade-in">
          <RestaurantProfile stats={stats} isRestaurantOwner={isRestaurantOwner} />
        </div>
      )}
      
      {currentTab === 'settings' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">Impostazioni</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Account</h3>
              <p className="text-sm text-gray-500 mb-4">
                Gestisci le impostazioni del tuo account e modifica le tue credenziali di accesso.
              </p>
              <Button variant="outline" size="sm">Modifica profilo</Button>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Notifiche</h3>
              <p className="text-sm text-gray-500 mb-4">
                Configura le notifiche per prenotazioni, recensioni e messaggi.
              </p>
              <Button variant="outline" size="sm">Gestisci notifiche</Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Esci dall'account</h3>
              <p className="text-sm text-gray-500 mb-4">
                Esci da questo dispositivo per proteggere la tua privacy.
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
