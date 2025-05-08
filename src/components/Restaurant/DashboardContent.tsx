
import React from 'react';
import RestaurantInfo from './RestaurantInfo';
import MenuViewer from './MenuViewer';
import TableManagement from './TableManagement';
import RestaurantVideos from '@/pages/restaurant/RestaurantVideos';
import RestaurantGallery from '@/pages/restaurant/RestaurantGallery';
import RestaurantBookings from '@/pages/restaurant/RestaurantBookings';
import RestaurantReviews from '@/pages/restaurant/RestaurantReviews';
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

  // Statistiche mockup per il profilo
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
      
      {/* Sezione offerte per i ristoratori */}
      {currentTab === 'offers' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Offerte Speciali</h2>
          <p className="text-gray-500 mb-6">Crea e gestisci offerte a tempo limitato per i tuoi clienti.</p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-medium flex items-center">
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded mr-2">ATTIVA</span>
                Menu degustazione scontato
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Offerta valida fino al 30/06/2025. 20% di sconto sul menu degustazione.
              </p>
              <div className="flex justify-end mt-3">
                <Button variant="outline" size="sm" className="text-xs">Modifica</Button>
                <Button variant="destructive" size="sm" className="text-xs ml-2">Disattiva</Button>
              </div>
            </div>
            
            <Button className="w-full">Crea nuova offerta</Button>
          </div>
        </div>
      )}
      
      {/* Sezioni specifiche per i ristoratori */}
      {currentTab === 'clients' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Gestione Clienti</h2>
          <p className="text-gray-500">Qui potrai visualizzare e gestire i clienti del tuo ristorante.</p>
          
          <div className="mt-4 space-y-4">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Marco Bianchi</h3>
                  <p className="text-sm text-gray-500">4 prenotazioni • Cliente dal 12/01/2025</p>
                </div>
                <Button variant="outline" size="sm">Dettagli</Button>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Laura Rossi</h3>
                  <p className="text-sm text-gray-500">2 prenotazioni • Cliente dal 03/02/2025</p>
                </div>
                <Button variant="outline" size="sm">Dettagli</Button>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Giovanni Verdi</h3>
                  <p className="text-sm text-gray-500">1 prenotazione • Cliente dal 25/04/2025</p>
                </div>
                <Button variant="outline" size="sm">Dettagli</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Profilo con statistiche */}
      {currentTab === 'profile' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Il tuo Profilo</h2>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="bg-gray-100 rounded-full p-4 mr-4">
                <User className="h-12 w-12 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{restaurantData.name}</h3>
                <p className="text-gray-500">{restaurantData.address}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center">
                  <div className="mr-3">{stat.icon}</div>
                  <div>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                    <p className="font-bold text-lg">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center justify-center">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {currentTab === 'settings' && isRestaurantOwner && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Impostazioni Ristorante</h2>
          <p className="text-gray-500">Qui potrai modificare le impostazioni del tuo ristorante.</p>
          
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-2">Informazioni del ristorante</h3>
              <Button variant="outline" className="w-full text-sm">Modifica informazioni</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-2">Orari di apertura</h3>
              <Button variant="outline" className="w-full text-sm">Gestisci orari</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-2">Notifiche</h3>
              <Button variant="outline" className="w-full text-sm">Configura notifiche</Button>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-2">Sicurezza e privacy</h3>
              <Button variant="outline" className="w-full text-sm">Impostazioni sicurezza</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
