import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, MapPin, Filter, Wheat, Coffee, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const categories = [
  { icon: <Wheat size={16} className="mr-2" />, name: "Pizzerie" },
  { icon: <Coffee size={16} className="mr-2" />, name: "Caffè" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Pasta" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Brunch" },
  { icon: <Coffee size={16} className="mr-2" />, name: "Pasticcerie" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Bistrot" }
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { restaurants, isLoading } = useRestaurantList();

  // The Layout component shouldn't try to use any React Router hooks
  const forceHideBadge = false;

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  // Filtra i ristoranti in base alla ricerca e ai filtri selezionati
  const filteredRestaurants = restaurants
    .filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.address && restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(restaurant => 
      selectedFilters.length === 0 || 
      // Check if cuisine matches any of the selected filters
      restaurant.cuisine?.toLowerCase().includes(selectedFilters.some(filter => 
        filter.toLowerCase()
      ).toString())
    );

  return (
    <Layout hideNavigation={forceHideBadge}>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Cerca ristoranti gluten-free</h1>
        
        <div className="relative mb-6">
          <Input 
            type="text" 
            placeholder="Inserisci nome o indirizzo del ristorante..." 
            className="pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Badge
                  key={category.name}
                  variant={selectedFilters.includes(category.name) ? "default" : "outline"}
                  className="cursor-pointer flex items-center"
                  onClick={() => handleFilterToggle(category.name)}
                >
                  {category.icon} {category.name}
                </Badge>
              ))}
            </div>
          </ScrollArea>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2 flex-shrink-0">
                <SlidersHorizontal size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtri avanzati</SheetTitle>
                <SheetDescription>
                  Personalizza la tua ricerca in base alle tue esigenze
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Certificazione</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline" className="cursor-pointer justify-center">AIC</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">AFC</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">Self-certified</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">Tutti</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Distanza</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Badge variant="outline" className="cursor-pointer justify-center">1 km</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">5 km</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">10 km</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">15 km</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">30 km</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">50+ km</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Valutazione minima</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <Badge variant="outline" className="cursor-pointer justify-center">1+</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">2+</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">3+</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">4+</Badge>
                    <Badge variant="outline" className="cursor-pointer justify-center">4.5+</Badge>
                  </div>
                </div>
              </div>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Applica filtri</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton loader
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex p-4 border rounded-lg mb-4">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <RestaurantCard 
                key={restaurant.id}
                restaurant={restaurant}
                onToggleFavorite={() => {}} // Add empty handler for toggle favorite
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Search size={48} className="mx-auto opacity-20 mb-4" />
              <p className="text-lg">Nessun ristorante trovato</p>
              <p className="mt-2">Prova a cambiare i filtri o la ricerca</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
