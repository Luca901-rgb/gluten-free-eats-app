
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Search, MapPin, Filter, Wheat, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

// Categorie di cucina senza glutine specifiche
const categories = [
  { icon: <Wheat size={16} className="mr-2" />, name: "Pizzeria" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Ristorante" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Trattoria" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Pasticceria" },
  { icon: <Wheat size={16} className="mr-2" />, name: "Panineria" }
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { 
    restaurants, 
    isLoading, 
    isOffline, 
    handleToggleFavorite,
    getUserLocation, 
    sortRestaurantsByDistance 
  } = useRestaurantList();

  // Richiedi la posizione dell'utente all'apertura della pagina
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

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

  // Filtra i ristoranti in base alla ricerca, ai filtri selezionati e alla proprietà "hasGlutenFreeOptions"
  const filteredRestaurants = restaurants
    .filter(restaurant => restaurant.hasGlutenFreeOptions === true) // Mostra SOLO ristoranti senza glutine
    .filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.address && restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(restaurant => 
      selectedFilters.length === 0 || 
      selectedFilters.some(filter => 
        restaurant.cuisine?.toLowerCase().includes(filter.toLowerCase())
      )
    )
    // Ordina i ristoranti per distanza
    .sort((a, b) => {
      // Se un ristorante ha distanceValue e l'altro no, quello con distanceValue viene prima
      if (a.distanceValue && !b.distanceValue) return -1;
      if (!a.distanceValue && b.distanceValue) return 1;
      // Se entrambi hanno distanceValue, ordina per valore
      if (a.distanceValue && b.distanceValue) return a.distanceValue - b.distanceValue;
      // Se nessuno ha distanceValue, mantieni l'ordine originale
      return 0;
    });

  return (
    <Layout hideNavigation={forceHideBadge}>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Cerca ristoranti senza glutine</h1>
        
        <div className="relative mb-6">
          <Input 
            type="text" 
            placeholder="Inserisci nome o indirizzo del ristorante..." 
            className="pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => getUserLocation()}
            title="Trova ristoranti vicino a me"
          >
            <MapPin size={16} className="mr-1" /> Vicino a me
          </Button>
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
                onToggleFavorite={handleToggleFavorite}
                onClick={() => handleRestaurantClick(restaurant.id)}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Search size={48} className="mx-auto opacity-20 mb-4" />
              <p className="text-lg">Nessun ristorante senza glutine trovato</p>
              <p className="mt-2">Prova a cambiare i filtri o la ricerca</p>
            </div>
          )}
          
          {isOffline && (
            <div className="p-3 text-center text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200 mt-4">
              Sei offline. I dati mostrati potrebbero non essere aggiornati.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
