
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTab } from '@/context/TabContext';
import { Home, Book, Calendar, Settings, Users } from 'lucide-react';

const RestaurantNavBar = () => {
  const navigate = useNavigate();
  const { setCurrentTab, currentTab } = useTab();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    navigate(`/restaurant-dashboard?tab=${tab}`);
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bookings', label: 'Prenotazioni', icon: Book },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
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
