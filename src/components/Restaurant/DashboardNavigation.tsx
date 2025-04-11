
import React, { useRef } from 'react';
import { 
  Home, Menu, VideoIcon, Image, 
  CalendarRange, Star, Table
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTab } from '@/context/TabContext';
import { cn } from '@/lib/utils';

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
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'menu', label: 'Menu', icon: <Menu size={18} /> },
    { id: 'videos', label: 'Videoricette', icon: <VideoIcon size={18} /> },
    { id: 'gallery', label: 'Galleria', icon: <Image size={18} /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <CalendarRange size={18} /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star size={18} /> },
  ];

  // Aggiungi la scheda "Tavoli" solo per i proprietari dei ristoranti
  if (isRestaurantOwner) {
    // Inseriamo "Tavoli" dopo "Menu"
    navigationButtons.splice(2, 0, { id: 'tables', label: 'Tavoli', icon: <Table size={18} /> });
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
        <div className="flex items-center px-4 py-3">
          <CarouselContent className="ml-0">
            {navigationButtons.map((button) => (
              <CarouselItem key={button.id} className="basis-auto pl-0 mr-2 min-w-min">
                <Button
                  variant={activeTab === button.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => navigateToTab(button.id)}
                  className="flex items-center gap-1 whitespace-nowrap"
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
