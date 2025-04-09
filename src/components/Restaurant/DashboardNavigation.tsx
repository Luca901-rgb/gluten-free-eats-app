
import React from 'react';
import { 
  Home, Menu, VideoIcon, Image, 
  CalendarRange, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface NavigationButton {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardNavigationProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
}

const DashboardNavigation = ({ activeTab, onNavigate }: DashboardNavigationProps) => {
  const navigationButtons: NavigationButton[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'menu', label: 'Menu', icon: <Menu size={18} /> },
    { id: 'videos', label: 'Videoricette', icon: <VideoIcon size={18} /> },
    { id: 'gallery', label: 'Galleria', icon: <Image size={18} /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <CalendarRange size={18} /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star size={18} /> },
  ];

  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
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
                  onClick={() => onNavigate(button.id)}
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
