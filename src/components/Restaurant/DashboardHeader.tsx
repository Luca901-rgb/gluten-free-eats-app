
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Menu, 
  Book, 
  Calendar, 
  Star, 
  Users, 
  Settings, 
  PieChart,
  FileText,
  Percent
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  restaurantName: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ restaurantName, currentTab, setCurrentTab }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };
  
  const tabs = [
    { id: 'home', label: 'Info', icon: <Home className="w-4 h-4 mr-2" /> },
    { id: 'menu', label: 'Menu', icon: <Menu className="w-4 h-4 mr-2" /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <Book className="w-4 h-4 mr-2" /> },
    { id: 'tables', label: 'Tavoli', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star className="w-4 h-4 mr-2" /> },
    { id: 'clients', label: 'Clienti', icon: <Users className="w-4 h-4 mr-2" /> },
    { id: 'offers', label: 'Offerte', icon: <Percent className="w-4 h-4 mr-2" /> },
    { id: 'profile', label: 'Profilo', icon: <PieChart className="w-4 h-4 mr-2" /> },
    { id: 'settings', label: 'Impostazioni', icon: <Settings className="w-4 h-4 mr-2" /> }
  ];
  
  // Mostra solo i tab più importanti su mobile
  const visibleTabs = isMobile
    ? tabs.filter(tab => ['home', 'menu', 'bookings', 'reviews', 'offers'].includes(tab.id))
    : tabs;
  
  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b">
        <h1 className="text-xl font-bold">{restaurantName}</h1>
      </div>
      
      <Tabs defaultValue={currentTab} onValueChange={handleTabChange} value={currentTab}>
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start whitespace-nowrap pb-1">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center text-sm px-3"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DashboardHeader;
