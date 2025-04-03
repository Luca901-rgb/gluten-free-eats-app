
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, MapPin, Phone, Mail, Globe, Save } from 'lucide-react';

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = React.useState({
    name: 'Ristorante Senza Glutine',
    address: 'Via Roma 123, Milano',
    phone: '+39 02 1234567',
    email: 'info@ristorantesenzaglutine.it',
    website: 'www.ristorantesenzaglutine.it',
    description: 'Il nostro ristorante offre un\'ampia varietà di piatti senza glutine, preparati con ingredienti di alta qualità e con massima attenzione alla contaminazione. La nostra cucina è certificata AIC.',
    openingHours: {
      monday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      tuesday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      wednesday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      thursday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      friday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      saturday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      sunday: { open: false, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
    },
    features: {
      takeaway: true,
      delivery: false,
      reservation: true,
      outdoor: true,
      wifi: true,
      parking: false,
      creditCard: true,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurant({ ...restaurant, [name]: value });
  };

  const handleOpeningHoursChange = (day: string, field: string, value: string | boolean) => {
    setRestaurant({
      ...restaurant,
      openingHours: {
        ...restaurant.openingHours,
        [day]: {
          ...restaurant.openingHours[day as keyof typeof restaurant.openingHours],
          [field]: value
        }
      }
    });
  };

  const handleFeatureChange = (feature: string, value: boolean) => {
    setRestaurant({
      ...restaurant,
      features: {
        ...restaurant.features,
        [feature]: value
      }
    });
  };

  const handleSave = () => {
    // In a real app, this would send data to the server
    alert('Profilo aggiornato con successo!');
  };

  const days = [
    { id: 'monday', label: 'Lunedì' },
    { id: 'tuesday', label: 'Martedì' },
    { id: 'wednesday', label: 'Mercoledì' },
    { id: 'thursday', label: 'Giovedì' },
    { id: 'friday', label: 'Venerdì' },
    { id: 'saturday', label: 'Sabato' },
    { id: 'sunday', label: 'Domenica' },
  ];

  const features = [
    { id: 'takeaway', label: 'Asporto' },
    { id: 'delivery', label: 'Consegna a domicilio' },
    { id: 'reservation', label: 'Prenotazione online' },
    { id: 'outdoor', label: 'Spazio all\'aperto' },
    { id: 'wifi', label: 'Wi-Fi gratuito' },
    { id: 'parking', label: 'Parcheggio' },
    { id: 'creditCard', label: 'Pagamento con carta' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Profilo Ristorante</h1>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save size={16} />
            <span>Salva Modifiche</span>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Informazioni Generali</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Ristorante</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={restaurant.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Indirizzo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      id="address"
                      name="address"
                      className="pl-8"
                      value={restaurant.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      id="phone"
                      name="phone"
                      className="pl-8"
                      value={restaurant.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      className="pl-8"
                      value={restaurant.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Sito Web</Label>
                  <div className="relative">
                    <Globe className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      id="website"
                      name="website"
                      className="pl-8"
                      value={restaurant.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea 
                  id="description"
                  name="description"
                  className="min-h-[120px]"
                  value={restaurant.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Orari di Apertura</h2>
            
            <div className="space-y-4">
              {days.map((day) => {
                const dayData = restaurant.openingHours[day.id as keyof typeof restaurant.openingHours];
                return (
                  <div key={day.id} className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="md:w-1/6">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`open-${day.id}`}
                          checked={dayData.open}
                          onCheckedChange={(checked) => handleOpeningHoursChange(day.id, 'open', checked)}
                        />
                        <Label htmlFor={`open-${day.id}`} className="cursor-pointer">{day.label}</Label>
                      </div>
                    </div>
                    
                    <div className="md:w-5/6">
                      {dayData.open ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">Pranzo:</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              className="w-24 text-sm"
                              value={dayData.from}
                              onChange={(e) => handleOpeningHoursChange(day.id, 'from', e.target.value)}
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              className="w-24 text-sm"
                              value={dayData.to}
                              onChange={(e) => handleOpeningHoursChange(day.id, 'to', e.target.value)}
                            />
                          </div>
                          
                          <div className="flex items-center ml-4">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">Cena:</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              className="w-24 text-sm"
                              value={dayData.fromDinner}
                              onChange={(e) => handleOpeningHoursChange(day.id, 'fromDinner', e.target.value)}
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              className="w-24 text-sm"
                              value={dayData.toDinner}
                              onChange={(e) => handleOpeningHoursChange(day.id, 'toDinner', e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Chiuso</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Caratteristiche</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-2">
                  <Switch
                    id={`feature-${feature.id}`}
                    checked={restaurant.features[feature.id as keyof typeof restaurant.features]}
                    onCheckedChange={(checked) => handleFeatureChange(feature.id, checked)}
                  />
                  <Label htmlFor={`feature-${feature.id}`} className="cursor-pointer">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} />
              <span>Salva Modifiche</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantProfile;
