
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Filter } from 'lucide-react';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

// Sample data - would be fetched from API in real app
const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'La Trattoria Senza Glutine',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 128,
    cuisine: 'Italiana',
    distance: '0.8 km',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Pizzeria Gluten Free',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 95,
    cuisine: 'Pizzeria',
    distance: '1.2 km',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Pasta & Risotti',
    image: 'https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 72,
    cuisine: 'Italiana',
    distance: '2.5 km',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'La Celiachia',
    image: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 103,
    cuisine: 'Bistro',
    distance: '3.1 km',
    isFavorite: false,
  },
];

const cuisines = [
  'Tutte', 'Italiana', 'Pizzeria', 'Bistro', 'Mediterranea', 'Fusion', 'Giapponese', 'Cinese'
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants);
  const [distance, setDistance] = useState<number[]>([5]);
  const [selectedCuisine, setSelectedCuisine] = useState('Tutte');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      let filtered = sampleRestaurants;
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by cuisine
      if (selectedCuisine !== 'Tutte') {
        filtered = filtered.filter(restaurant => 
          restaurant.cuisine === selectedCuisine
        );
      }
      
      // Filter by distance
      filtered = filtered.filter(restaurant => {
        const distanceValue = parseFloat(restaurant.distance?.split(' ')[0] || '0');
        return distanceValue <= distance[0];
      });
      
      setRestaurants(filtered);
      setIsLoading(false);
      
      toast.success(`Trovati ${filtered.length} ristoranti`);
    }, 1000);
  };

  const handleToggleFavorite = (id: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isFavorite: !restaurant.isFavorite } 
        : restaurant
    ));
  };

  const handleUseCurrentLocation = () => {
    toast.info('Utilizzo della posizione corrente...');
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-poppins font-bold text-primary">Cerca ristoranti</h1>
        
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text"
                placeholder="Cerca ristoranti gluten free..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Filter size={18} />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Filtri di ricerca</DrawerTitle>
                    <DrawerDescription>Perfeziona i risultati della tua ricerca</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-6">
                    <div className="space-y-2">
                      <Label>Tipo di cucina</Label>
                      <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona tipo di cucina" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisines.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Distanza massima</Label>
                        <span className="text-sm text-gray-500">{distance[0]} km</span>
                      </div>
                      <Slider 
                        defaultValue={[5]} 
                        max={20} 
                        step={0.5} 
                        value={distance}
                        onValueChange={setDistance}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Opzioni</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="certificati" defaultChecked />
                          <label htmlFor="certificati" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Solo ristoranti certificati AIC
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="recensioni" />
                          <label htmlFor="recensioni" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Solo con recensioni verificate
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button type="submit" onClick={handleSearch}>Applica filtri</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Annulla</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
            <Button type="submit" className="flex-shrink-0">
              Cerca
            </Button>
          </form>

          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              className="text-xs flex items-center text-primary" 
              onClick={handleUseCurrentLocation}
            >
              <MapPin size={14} className="mr-1" />
              Usa la mia posizione attuale
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-poppins text-lg font-semibold">Risultati</h2>
            <span className="text-sm text-gray-500">{restaurants.length} ristoranti trovati</span>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {restaurants.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {restaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Nessun risultato trovato</h3>
                  <p className="text-gray-500 mb-4">Prova a modificare i filtri di ricerca</p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setSelectedCuisine('Tutte');
                    setDistance([5]);
                    setRestaurants(sampleRestaurants);
                  }}>
                    Reimposta ricerca
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
