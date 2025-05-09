
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, Building, Phone, MapPin, Clock, Mail, User, Globe, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface RestaurantData {
  name: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  description?: string;
  website?: string;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services?: {
    delivery?: boolean;
    takeaway?: boolean;
    glutenFreeMenu?: boolean;
    separateKitchen?: boolean;
    aicCertified?: boolean;
  };
}

const RestaurantSettingsPage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Pre-popola immediatamente i dati dal localStorage
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: localStorage.getItem('restaurantName') || '',
    ownerName: localStorage.getItem('ownerName') || '',
    email: localStorage.getItem('restaurantEmail') || localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('restaurantPhone') || '',
    address: localStorage.getItem('restaurantAddress') || '',
    city: localStorage.getItem('restaurantCity') || '',
    postalCode: localStorage.getItem('restaurantPostalCode') || '',
    province: localStorage.getItem('restaurantProvince') || '',
    description: localStorage.getItem('restaurantDescription') || '',
    website: localStorage.getItem('restaurantWebsite') || '',
    openingHours: {
      monday: localStorage.getItem('restaurantHoursMonday') || '',
      tuesday: localStorage.getItem('restaurantHoursTuesday') || '',
      wednesday: localStorage.getItem('restaurantHoursWednesday') || '',
      thursday: localStorage.getItem('restaurantHoursThursday') || '',
      friday: localStorage.getItem('restaurantHoursFriday') || '',
      saturday: localStorage.getItem('restaurantHoursSaturday') || '',
      sunday: localStorage.getItem('restaurantHoursSunday') || '',
    },
    services: {
      delivery: localStorage.getItem('restaurantDelivery') === 'true',
      takeaway: localStorage.getItem('restaurantTakeaway') === 'true',
      glutenFreeMenu: localStorage.getItem('restaurantGlutenFreeMenu') === 'true' || true,
      separateKitchen: localStorage.getItem('restaurantSeparateKitchen') === 'true' || false,
      aicCertified: localStorage.getItem('restaurantAicCertified') === 'true' || false,
    }
  });

  useEffect(() => {
    const loadRestaurantData = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        if (!restaurantData.name || !restaurantData.email) {
          navigate('/login');
        }
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "restaurants", currentUser.uid));
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          setRestaurantData(current => ({
            ...current,
            name: firestoreData.name || current.name,
            ownerName: firestoreData.ownerName || current.ownerName,
            phone: firestoreData.phone || current.phone,
            address: firestoreData.address || current.address,
            city: firestoreData.city || current.city,
            postalCode: firestoreData.postalCode || current.postalCode,
            province: firestoreData.province || current.province,
            description: firestoreData.description || current.description,
            website: firestoreData.website || current.website,
            openingHours: firestoreData.openingHours || current.openingHours,
            services: firestoreData.services || current.services,
          }));
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati ristorante:", err);
        // Continua con i dati del localStorage
      }
    };
    
    loadRestaurantData();
  }, [navigate, restaurantData.name, restaurantData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHoursChange = (day: string, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setRestaurantData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      
      // Aggiorna localStorage per tutti i campi
      localStorage.setItem('restaurantName', restaurantData.name);
      localStorage.setItem('ownerName', restaurantData.ownerName);
      localStorage.setItem('restaurantEmail', restaurantData.email);
      localStorage.setItem('restaurantPhone', restaurantData.phone || '');
      localStorage.setItem('restaurantAddress', restaurantData.address || '');
      localStorage.setItem('restaurantCity', restaurantData.city || '');
      localStorage.setItem('restaurantPostalCode', restaurantData.postalCode || '');
      localStorage.setItem('restaurantProvince', restaurantData.province || '');
      localStorage.setItem('restaurantDescription', restaurantData.description || '');
      localStorage.setItem('restaurantWebsite', restaurantData.website || '');
      
      // Orari
      localStorage.setItem('restaurantHoursMonday', restaurantData.openingHours?.monday || '');
      localStorage.setItem('restaurantHoursTuesday', restaurantData.openingHours?.tuesday || '');
      localStorage.setItem('restaurantHoursWednesday', restaurantData.openingHours?.wednesday || '');
      localStorage.setItem('restaurantHoursThursday', restaurantData.openingHours?.thursday || '');
      localStorage.setItem('restaurantHoursFriday', restaurantData.openingHours?.friday || '');
      localStorage.setItem('restaurantHoursSaturday', restaurantData.openingHours?.saturday || '');
      localStorage.setItem('restaurantHoursSunday', restaurantData.openingHours?.sunday || '');
      
      // Servizi
      localStorage.setItem('restaurantDelivery', String(restaurantData.services?.delivery || false));
      localStorage.setItem('restaurantTakeaway', String(restaurantData.services?.takeaway || false));
      localStorage.setItem('restaurantGlutenFreeMenu', String(restaurantData.services?.glutenFreeMenu || true));
      localStorage.setItem('restaurantSeparateKitchen', String(restaurantData.services?.separateKitchen || false));
      localStorage.setItem('restaurantAicCertified', String(restaurantData.services?.aicCertified || false));
      
      // Se l'utente è autenticato, aggiorna anche Firestore
      if (currentUser) {
        await updateDoc(doc(db, "restaurants", currentUser.uid), {
          name: restaurantData.name,
          ownerName: restaurantData.ownerName,
          phone: restaurantData.phone || '',
          address: restaurantData.address || '',
          city: restaurantData.city || '',
          postalCode: restaurantData.postalCode || '',
          province: restaurantData.province || '',
          description: restaurantData.description || '',
          website: restaurantData.website || '',
          openingHours: restaurantData.openingHours || {},
          services: restaurantData.services || {},
        });
      }
      
      toast.success("Informazioni del ristorante aggiornate con successo");
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
      toast.error("Errore nel salvataggio delle informazioni");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Dati Ristorante</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informazioni Ristorante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Ristorante</Label>
              <div className="relative">
                <Input 
                  id="name" 
                  name="name" 
                  value={restaurantData.name} 
                  onChange={handleInputChange}
                  placeholder="Nome del ristorante"
                  className="pl-9"
                />
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                name="description"
                value={restaurantData.description || ''}
                onChange={handleInputChange}
                placeholder="Descrizione del ristorante"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    name="email" 
                    value={restaurantData.email} 
                    onChange={handleInputChange} 
                    placeholder="Email del ristorante"
                    className="pl-9"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={restaurantData.phone || ''} 
                    onChange={handleInputChange} 
                    placeholder="Telefono del ristorante"
                    className="pl-9"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Sito Web</Label>
              <div className="relative">
                <Input 
                  id="website" 
                  name="website" 
                  value={restaurantData.website || ''} 
                  onChange={handleInputChange} 
                  placeholder="https://www.example.com"
                  className="pl-9"
                />
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Indirizzo Ristorante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Via e numero civico</Label>
              <div className="relative">
                <Input 
                  id="address" 
                  name="address" 
                  value={restaurantData.address || ''} 
                  onChange={handleInputChange} 
                  placeholder="Via Roma 123"
                  className="pl-9"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Città</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={restaurantData.city || ''} 
                  onChange={handleInputChange} 
                  placeholder="Milano"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">CAP</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={restaurantData.postalCode || ''} 
                  onChange={handleInputChange} 
                  placeholder="20100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={restaurantData.province || ''} 
                  onChange={handleInputChange} 
                  placeholder="MI"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dati Proprietario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Nome e Cognome</Label>
              <div className="relative">
                <Input 
                  id="ownerName" 
                  name="ownerName" 
                  value={restaurantData.ownerName} 
                  onChange={handleInputChange} 
                  placeholder="Nome del proprietario"
                  className="pl-9"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Orari di Apertura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monday">Lunedì</Label>
                <Input 
                  id="monday" 
                  value={restaurantData.openingHours?.monday || ''} 
                  onChange={(e) => handleHoursChange('monday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tuesday">Martedì</Label>
                <Input 
                  id="tuesday" 
                  value={restaurantData.openingHours?.tuesday || ''} 
                  onChange={(e) => handleHoursChange('tuesday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wednesday">Mercoledì</Label>
                <Input 
                  id="wednesday" 
                  value={restaurantData.openingHours?.wednesday || ''} 
                  onChange={(e) => handleHoursChange('wednesday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thursday">Giovedì</Label>
                <Input 
                  id="thursday" 
                  value={restaurantData.openingHours?.thursday || ''} 
                  onChange={(e) => handleHoursChange('thursday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="friday">Venerdì</Label>
                <Input 
                  id="friday" 
                  value={restaurantData.openingHours?.friday || ''} 
                  onChange={(e) => handleHoursChange('friday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="saturday">Sabato</Label>
                <Input 
                  id="saturday" 
                  value={restaurantData.openingHours?.saturday || ''} 
                  onChange={(e) => handleHoursChange('saturday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sunday">Domenica</Label>
                <Input 
                  id="sunday" 
                  value={restaurantData.openingHours?.sunday || ''} 
                  onChange={(e) => handleHoursChange('sunday', e.target.value)} 
                  placeholder="12:00-15:00, 19:00-23:00"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Servizi Offerti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="delivery" 
                  checked={restaurantData.services?.delivery || false} 
                  onCheckedChange={(checked) => handleServiceChange('delivery', !!checked)}
                />
                <Label htmlFor="delivery" className="cursor-pointer">Consegna a domicilio</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="takeaway" 
                  checked={restaurantData.services?.takeaway || false} 
                  onCheckedChange={(checked) => handleServiceChange('takeaway', !!checked)}
                />
                <Label htmlFor="takeaway" className="cursor-pointer">Asporto</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="glutenFreeMenu" 
                  checked={restaurantData.services?.glutenFreeMenu || true} 
                  onCheckedChange={(checked) => handleServiceChange('glutenFreeMenu', !!checked)}
                  disabled
                />
                <Label htmlFor="glutenFreeMenu" className="cursor-pointer">Menu senza glutine</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="separateKitchen" 
                  checked={restaurantData.services?.separateKitchen || false} 
                  onCheckedChange={(checked) => handleServiceChange('separateKitchen', !!checked)}
                />
                <Label htmlFor="separateKitchen" className="cursor-pointer">Cucina separata</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="aicCertified" 
                  checked={restaurantData.services?.aicCertified || false} 
                  onCheckedChange={(checked) => handleServiceChange('aicCertified', !!checked)}
                />
                <Label htmlFor="aicCertified" className="cursor-pointer">Certificato AIC</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-6" />
        
        <Button 
          className="w-full" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvataggio in corso
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salva modifiche
            </>
          )}
        </Button>
      </div>
    </Layout>
  );
};

export default RestaurantSettingsPage;
