
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Info, Store, Image, CalendarClock, Menu, Video, MapPin, Phone, Globe, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface RestaurantCardRegistrationProps {
  onComplete?: (success: boolean) => void;
}

const RestaurantCardRegistration: React.FC<RestaurantCardRegistrationProps> = ({ 
  onComplete 
}) => {
  const isMobile = useIsMobile();
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    cuisine: '',
    priceRange: '',
    coverImage: '',
    hasGlutenFreeOptions: true,
    openingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    openingHours: {
      lunchStart: '12:00',
      lunchEnd: '15:00',
      dinnerStart: '19:00',
      dinnerEnd: '23:00'
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setRestaurantData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setRestaurantData(prev => ({
      ...prev,
      openingDays: {
        ...prev.openingDays,
        [day]: checked
      }
    }));
  };

  const handleHoursChange = (timeSlot: string, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [timeSlot]: value
      }
    }));
  };

  const handleContinue = () => {
    if (!restaurantData.name || !restaurantData.address || !restaurantData.phone) {
      toast.error("Completa i campi obbligatori per continuare");
      return;
    }
    
    // Salva i dati in localStorage per il profilo del ristorante
    localStorage.setItem('restaurantName', restaurantData.name);
    localStorage.setItem('restaurantAddress', restaurantData.address);
    localStorage.setItem('restaurantPhone', restaurantData.phone);
    localStorage.setItem('restaurantDescription', restaurantData.description);
    localStorage.setItem('restaurantCuisine', restaurantData.cuisine);
    localStorage.setItem('restaurantWebsite', restaurantData.website);
    localStorage.setItem('restaurantHasGlutenFree', restaurantData.hasGlutenFreeOptions.toString());
    localStorage.setItem('restaurantOpeningDays', JSON.stringify(restaurantData.openingDays));
    localStorage.setItem('restaurantOpeningHours', JSON.stringify(restaurantData.openingHours));

    toast.success("Dati del ristorante salvati con successo");
    
    if (onComplete) {
      onComplete(true);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Informazioni del Ristorante
        </CardTitle>
        <CardDescription>
          Inserisci tutte le informazioni del tuo ristorante per completare la registrazione
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 mb-6">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">Adesione al programma confermata</p>
            <p className="text-sm text-green-600">
              Completa i dati del tuo ristorante per essere visibile ai clienti.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Nome del ristorante *</Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                value={restaurantData.name}
                onChange={handleChange}
                placeholder="Il nome del tuo ristorante"
                className="pl-10"
                required
              />
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-base">Indirizzo completo *</Label>
            <div className="relative">
              <Input
                id="address"
                name="address"
                value={restaurantData.address}
                onChange={handleChange}
                placeholder="Via, numero civico, città, CAP"
                className="pl-10"
                required
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base">Telefono *</Label>
            <div className="relative">
              <Input
                id="phone"
                name="phone"
                value={restaurantData.phone}
                onChange={handleChange}
                placeholder="+39 123 4567890"
                className="pl-10"
                required
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website" className="text-base">Sito web</Label>
            <div className="relative">
              <Input
                id="website"
                name="website"
                value={restaurantData.website}
                onChange={handleChange}
                placeholder="www.ristorantesenzaglutine.it"
                className="pl-10"
              />
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuisine" className="text-base">Tipo di cucina</Label>
              <Select value={restaurantData.cuisine} onValueChange={(value) => handleSelectChange('cuisine', value)}>
                <SelectTrigger id="cuisine">
                  <SelectValue placeholder="Seleziona tipo di cucina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italiana">Italiana</SelectItem>
                  <SelectItem value="pizzeria">Pizzeria</SelectItem>
                  <SelectItem value="internazionale">Internazionale</SelectItem>
                  <SelectItem value="fusion">Fusion</SelectItem>
                  <SelectItem value="asiatica">Asiatica</SelectItem>
                  <SelectItem value="americana">Americana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priceRange" className="text-base">Fascia di prezzo</Label>
              <Select value={restaurantData.priceRange} onValueChange={(value) => handleSelectChange('priceRange', value)}>
                <SelectTrigger id="priceRange">
                  <SelectValue placeholder="Seleziona fascia di prezzo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="€">€ - Economico</SelectItem>
                  <SelectItem value="€€">€€ - Nella media</SelectItem>
                  <SelectItem value="€€€">€€€ - Costoso</SelectItem>
                  <SelectItem value="€€€€">€€€€ - Lusso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Descrizione del ristorante</Label>
            <Textarea
              id="description"
              name="description"
              value={restaurantData.description}
              onChange={handleChange}
              placeholder="Descrivi il tuo ristorante, la vostra storia, le specialità e i servizi offerti..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">Orari di apertura</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md">
              <div className="space-y-4">
                <h4 className="font-medium">Giorni di apertura</h4>
                <div className="space-y-2">
                  {[
                    { id: 'monday', label: 'Lunedì' },
                    { id: 'tuesday', label: 'Martedì' },
                    { id: 'wednesday', label: 'Mercoledì' },
                    { id: 'thursday', label: 'Giovedì' },
                    { id: 'friday', label: 'Venerdì' },
                    { id: 'saturday', label: 'Sabato' },
                    { id: 'sunday', label: 'Domenica' }
                  ].map(day => (
                    <div className="flex items-center space-x-2" key={day.id}>
                      <Checkbox
                        id={day.id}
                        checked={restaurantData.openingDays[day.id as keyof typeof restaurantData.openingDays]}
                        onCheckedChange={(checked) => handleDayChange(day.id, !!checked)}
                      />
                      <Label htmlFor={day.id} className="cursor-pointer">{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Orari standard</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Pranzo</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="lunchStart" className="text-xs">Dalle</Label>
                        <Input
                          id="lunchStart"
                          type="time"
                          value={restaurantData.openingHours.lunchStart}
                          onChange={(e) => handleHoursChange('lunchStart', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lunchEnd" className="text-xs">Alle</Label>
                        <Input
                          id="lunchEnd"
                          type="time"
                          value={restaurantData.openingHours.lunchEnd}
                          onChange={(e) => handleHoursChange('lunchEnd', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-500">Cena</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="dinnerStart" className="text-xs">Dalle</Label>
                        <Input
                          id="dinnerStart"
                          type="time"
                          value={restaurantData.openingHours.dinnerStart}
                          onChange={(e) => handleHoursChange('dinnerStart', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dinnerEnd" className="text-xs">Alle</Label>
                        <Input
                          id="dinnerEnd"
                          type="time"
                          value={restaurantData.openingHours.dinnerEnd}
                          onChange={(e) => handleHoursChange('dinnerEnd', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Nota: Potrai specificare orari diversi per giorni specifici nella dashboard ristorante</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasGlutenFreeOptions"
              name="hasGlutenFreeOptions"
              checked={restaurantData.hasGlutenFreeOptions}
              onCheckedChange={(checked) => setRestaurantData(prev => ({ ...prev, hasGlutenFreeOptions: !!checked }))}
            />
            <Label htmlFor="hasGlutenFreeOptions" className="cursor-pointer">
              Offriamo un menu completamente senza glutine o con opzioni senza glutine
            </Label>
          </div>
          
          <div className="mt-4 p-4 border rounded-md space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Image className="h-5 w-5" />
              Immagini e Galleria
            </h4>
            <p className="text-sm text-gray-600">Potrai caricare foto del tuo ristorante e dei piatti dalla dashboard dopo la registrazione.</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <Button 
          onClick={handleContinue}
          className="w-full"
        >
          Continua alla dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
