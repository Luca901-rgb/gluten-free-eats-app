
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTab } from '@/context/TabContext';
import { Home, Book, Calendar, Settings, Users } from 'lucide-react';
import safeStorage from '@/lib/safeStorage';

const RestaurantNavBar = () => {
  const navigate = useNavigate();
  const { currentTab, setCurrentTab } = useTab();

  const handleTabChange = (tab: string) => {
    console.log("Cambiando tab a:", tab);
    setCurrentTab(tab);
    
    // Verifica se l'utente è un ristoratore prima di navigare
    const isRestaurantOwner = safeStorage.getItem('isRestaurantOwner') === 'true';
    const userType = safeStorage.getItem('userType');
    
    if (isRestaurantOwner || userType === 'restaurant') {
      // Imposta il parametro corretto nella URL
      const url = `/restaurant-dashboard?tab=${tab}`;
      console.log("Navigando a:", url);
      navigate(url, { replace: true });
    } else {
      // Se per qualche motivo l'utente non è un ristoratore, reindirizza alla pagina corretta
      console.log("Utente non è ristoratore, reindirizzamento a user-redirect");
      navigate('/user-redirect');
    }
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bookings', label: 'Prenotazioni', icon: Book },
    { id: 'tables', label: 'Tavoli', icon: Calendar },
    { id: 'clients', label: 'Clienti', icon: Users },
    { id: 'settings', label: 'Impostazioni', icon: Settings }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 p-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-green-600' : 'text-gray-500'} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantNavBar;
