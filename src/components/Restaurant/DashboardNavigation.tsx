
import React, { useRef } from 'react';
import { 
  Home, Menu, Video, Image as ImageIcon, 
  CalendarRange, Star, Table, Wheat, UtensilsCrossed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTab } from '@/context/TabContext';

interface NavigationButton {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardNavigationProps {
  isRestaurantOwner?: boolean;
}

const DashboardNavigation = ({ isRestaurantOwner = false }: DashboardNavigationProps) => {
  const { activeTab, navigateToTab } = useTab();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Definizione dei pulsanti di navigazione base
  let navigationButtons: NavigationButton[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <Menu className="w-4 h-4" /> },
    { id: 'videos', label: 'Videoricette', icon: <Video className="w-4 h-4" /> },
    { id: 'gallery', label: 'Galleria', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star className="w-4 h-4" /> },
  ];

  // Aggiungi la scheda "Tavoli" solo per i proprietari dei ristoranti
  if (isRestaurantOwner) {
    // Inseriamo "Tavoli" dopo "Menu"
    navigationButtons.splice(2, 0, { id: 'tables', label: 'Tavoli', icon: <Table className="w-4 h-4" /> });
  }

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
                  variant={activeTab === button.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => navigateToTab(button.id)}
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
