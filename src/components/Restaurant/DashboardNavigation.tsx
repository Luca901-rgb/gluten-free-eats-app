
import React, { useRef } from 'react';
import { 
  Home, Menu, Video, Image as ImageIcon, 
  CalendarRange, Star, Table, Settings, Users,
  FileText, PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTab } from '@/context/TabContext';
import { useNavigate } from 'react-router-dom';

interface NavigationButton {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardNavigationProps {
  isRestaurantOwner?: boolean;
}

const DashboardNavigation = ({ isRestaurantOwner = false }: DashboardNavigationProps) => {
  const { currentTab, setCurrentTab } = useTab();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Controlla se siamo nella dashboard o in una pagina specifica
  const handleTabClick = (tabId: string) => {
    console.log("Cliccando su tab:", tabId);
    setCurrentTab(tabId);
    
    // Aggiorna l'URL con il parametro della tab
    navigate(`/restaurant-dashboard?tab=${tabId}`, { replace: true });
  };

  // Definizione dei pulsanti di navigazione per i clienti
  let clientNavigationButtons: NavigationButton[] = [
    { id: 'home', label: 'Info', icon: <Home className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <Menu className="w-4 h-4" /> },
    { id: 'videos', label: 'Videoricette', icon: <Video className="w-4 h-4" /> },
    { id: 'gallery', label: 'Galleria', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star className="w-4 h-4" /> },
  ];

  // Definizione dei pulsanti di navigazione per i ristoratori
  let restaurantOwnerButtons: NavigationButton[] = [
    { id: 'home', label: 'Info', icon: <Home className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <Menu className="w-4 h-4" /> },
    { id: 'tables', label: 'Tavoli', icon: <Table className="w-4 h-4" /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'clients', label: 'Clienti', icon: <Users className="w-4 h-4" /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star className="w-4 h-4" /> },
    { id: 'offers', label: 'Offerte', icon: <FileText className="w-4 h-4" /> },
    { id: 'profile', label: 'Profilo', icon: <PieChart className="w-4 h-4" /> },
    { id: 'settings', label: 'Impostazioni', icon: <Settings className="w-4 h-4" /> },
  ];

  // Usa i pulsanti appropriati in base al tipo di utente
  const navigationButtons = isRestaurantOwner ? restaurantOwnerButtons : clientNavigationButtons;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10" ref={tabsContainerRef}>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full"
      >
        <div className="flex items-center px-4 py-2">
          <CarouselContent className="ml-0">
            {navigationButtons.map((button) => (
              <CarouselItem key={button.id} className="basis-auto pl-0 mr-1 min-w-min">
                <Button
                  variant={currentTab === button.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabClick(button.id)}
                  className="flex items-center gap-1 whitespace-nowrap py-1 h-8 text-xs"
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
  );
};

export default DashboardNavigation;
