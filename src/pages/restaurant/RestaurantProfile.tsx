
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit, 
  Save, 
  X,
  UserRound,
  Store
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const RestaurantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Restaurant information - in a real app, this would come from an API
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'La Trattoria Senza Glutine',
    description: 'Ristorante 100% gluten free specializzato in cucina italiana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine.',
    address: 'Via Roma 123, Milano, 20100',
    phone: '+39 02 1234567',
    email: 'info@trattoriasenzaglutine.it',
    website: 'www.trattoriasenzaglutine.it',
    ownerName: 'Mario Rossi',
    taxId: 'IT12345678901', // P.IVA
    businessType: 'Ristorante', // Tipologia attività
    foundationYear: '2010', // Anno fondazione
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // In a real app, we would save to an API
    setIsEditing(false);
    toast.success('Informazioni del ristorante aggiornate con successo');
  };

  const handleCancel = () => {
    // Reset to original values - in a real app, we would fetch from API again
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-poppins font-bold text-primary">Profilo Ristorante</h1>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center text-white">
              <Store size={32} />
            </div>
            <div>
              <CardTitle>{restaurantInfo.name}</CardTitle>
              <CardDescription>{restaurantInfo.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dati Ristorante */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Dati Ristorante</CardTitle>
            <CardDescription>Informazioni generali del ristorante</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={handleEditToggle}>
              <Edit size={16} className="mr-2" />
              Modifica
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Ristorante</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={restaurantInfo.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    value={restaurantInfo.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={restaurantInfo.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={restaurantInfo.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sito Web</Label>
                  <Input 
                    id="website" 
                    name="website"
                    value={restaurantInfo.website}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Indirizzo</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={restaurantInfo.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Partita IVA</Label>
                  <Input 
                    id="taxId" 
                    name="taxId"
                    value={restaurantInfo.taxId}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipologia Attività</Label>
                  <Input 
                    id="businessType" 
                    name="businessType"
                    value={restaurantInfo.businessType}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Nome Titolare</Label>
                  <Input 
                    id="ownerName" 
                    name="ownerName"
                    value={restaurantInfo.ownerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundationYear">Anno Fondazione</Label>
                  <Input 
                    id="foundationYear" 
                    name="foundationYear"
                    value={restaurantInfo.foundationYear}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Descrizione</p>
                <p>{restaurantInfo.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{restaurantInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{restaurantInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{restaurantInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{restaurantInfo.website}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Partita IVA</p>
                  <p>{restaurantInfo.taxId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipologia Attività</p>
                  <p>{restaurantInfo.businessType}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome Titolare</p>
                  <p>{restaurantInfo.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Anno Fondazione</p>
                  <p>{restaurantInfo.foundationYear}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X size={16} className="mr-2" />
              Annulla
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Salva
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default RestaurantProfile;
