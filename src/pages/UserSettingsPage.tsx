
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, User, Phone, MapPin, Calendar, Mail, Info, Wheat } from 'lucide-react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserData {
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  dietaryRestrictions?: {
    glutenFree: boolean;
    lactoseFree?: boolean;
    vegan?: boolean;
    vegetarian?: boolean;
    other?: string;
  };
  gender?: string;
  newsletter?: boolean;
  notificationsEnabled?: boolean;
}

const UserSettingsPage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Pre-popola immediatamente i dati dal localStorage
  const [userData, setUserData] = useState<UserData>({
    displayName: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    address: localStorage.getItem('userAddress') || '',
    city: localStorage.getItem('userCity') || '',
    postalCode: localStorage.getItem('userPostalCode') || '',
    province: localStorage.getItem('userProvince') || '',
    birthdate: localStorage.getItem('userBirthdate') || '',
    gender: localStorage.getItem('userGender') || '',
    dietaryRestrictions: {
      glutenFree: localStorage.getItem('userDietaryGlutenFree') === 'true' || true,
      lactoseFree: localStorage.getItem('userDietaryLactoseFree') === 'true' || false,
      vegan: localStorage.getItem('userDietaryVegan') === 'true' || false,
      vegetarian: localStorage.getItem('userDietaryVegetarian') === 'true' || false,
      other: localStorage.getItem('userDietaryOther') || '',
    },
    newsletter: localStorage.getItem('userNewsletter') === 'true' || false,
    notificationsEnabled: localStorage.getItem('userNotifications') === 'true' || true
  });

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        if (!userData.displayName || !userData.email) {
          navigate('/login');
        }
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          setUserData(current => ({
            ...current,
            displayName: firestoreData.displayName || current.displayName,
            phone: firestoreData.phone || current.phone,
            address: firestoreData.address || current.address,
            city: firestoreData.city || current.city,
            postalCode: firestoreData.postalCode || current.postalCode,
            province: firestoreData.province || current.province,
            birthdate: firestoreData.birthdate || current.birthdate,
            gender: firestoreData.gender || current.gender,
            dietaryRestrictions: firestoreData.dietaryRestrictions || current.dietaryRestrictions,
            newsletter: firestoreData.newsletter !== undefined ? firestoreData.newsletter : current.newsletter,
            notificationsEnabled: firestoreData.notificationsEnabled !== undefined ? firestoreData.notificationsEnabled : current.notificationsEnabled,
          }));
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati utente:", err);
        // Continua con i dati del localStorage
      }
    };
    
    loadUserData();
  }, [navigate, userData.displayName, userData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDietaryChange = (key: string, value: boolean) => {
    setUserData(prev => ({
      ...prev,
      dietaryRestrictions: {
        ...prev.dietaryRestrictions,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      
      // Aggiorna localStorage per tutti i campi
      localStorage.setItem('userName', userData.displayName);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userPhone', userData.phone || '');
      localStorage.setItem('userAddress', userData.address || '');
      localStorage.setItem('userCity', userData.city || '');
      localStorage.setItem('userPostalCode', userData.postalCode || '');
      localStorage.setItem('userProvince', userData.province || '');
      localStorage.setItem('userBirthdate', userData.birthdate || '');
      localStorage.setItem('userGender', userData.gender || '');
      localStorage.setItem('userDietaryGlutenFree', String(userData.dietaryRestrictions?.glutenFree || true));
      localStorage.setItem('userDietaryLactoseFree', String(userData.dietaryRestrictions?.lactoseFree || false));
      localStorage.setItem('userDietaryVegan', String(userData.dietaryRestrictions?.vegan || false));
      localStorage.setItem('userDietaryVegetarian', String(userData.dietaryRestrictions?.vegetarian || false));
      localStorage.setItem('userDietaryOther', userData.dietaryRestrictions?.other || '');
      localStorage.setItem('userNewsletter', String(userData.newsletter || false));
      localStorage.setItem('userNotifications', String(userData.notificationsEnabled || true));
      
      // Se l'utente è autenticato, aggiorna anche Firestore
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          displayName: userData.displayName,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          province: userData.province || '',
          birthdate: userData.birthdate || '',
          gender: userData.gender || '',
          dietaryRestrictions: userData.dietaryRestrictions || { glutenFree: true },
          newsletter: userData.newsletter || false,
          notificationsEnabled: userData.notificationsEnabled || true,
        });
      }
      
      toast.success("Informazioni aggiornate con successo");
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
          <h1 className="text-2xl font-bold">Il Mio Profilo</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dati Personali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nome e Cognome</Label>
              <div className="relative">
                <Input 
                  id="displayName" 
                  name="displayName" 
                  value={userData.displayName} 
                  onChange={handleInputChange}
                  placeholder="Il tuo nome e cognome"
                  className="pl-9"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  name="email" 
                  value={userData.email} 
                  readOnly 
                  disabled 
                  className="bg-gray-50 pl-9"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              <p className="text-sm text-muted-foreground">L'indirizzo email non può essere modificato</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={userData.phone || ''} 
                    onChange={handleInputChange} 
                    placeholder="Il tuo numero di telefono"
                    className="pl-9"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthdate">Data di nascita</Label>
                <div className="relative">
                  <Input 
                    id="birthdate" 
                    name="birthdate" 
                    type="date"
                    value={userData.birthdate || ''} 
                    onChange={handleInputChange} 
                    className="pl-9"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Genere</Label>
              <Select value={userData.gender} onValueChange={(value) => setUserData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleziona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Uomo</SelectItem>
                  <SelectItem value="female">Donna</SelectItem>
                  <SelectItem value="other">Altro</SelectItem>
                  <SelectItem value="prefer-not-to-say">Preferisco non specificare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Indirizzo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Via e numero civico</Label>
              <div className="relative">
                <Input 
                  id="address" 
                  name="address" 
                  value={userData.address || ''} 
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
                  value={userData.city || ''} 
                  onChange={handleInputChange} 
                  placeholder="Milano"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">CAP</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={userData.postalCode || ''} 
                  onChange={handleInputChange} 
                  placeholder="20100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={userData.province || ''} 
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
              <Wheat className="h-5 w-5" />
              Preferenze Alimentari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="glutenFree" 
                  checked={userData.dietaryRestrictions?.glutenFree || true} 
                  onCheckedChange={(checked) => handleDietaryChange('glutenFree', !!checked)}
                  disabled
                />
                <Label htmlFor="glutenFree" className="cursor-pointer">Alimentazione senza glutine</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lactoseFree" 
                  checked={userData.dietaryRestrictions?.lactoseFree || false} 
                  onCheckedChange={(checked) => handleDietaryChange('lactoseFree', !!checked)}
                />
                <Label htmlFor="lactoseFree" className="cursor-pointer">Intolleranza al lattosio</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="vegetarian" 
                  checked={userData.dietaryRestrictions?.vegetarian || false} 
                  onCheckedChange={(checked) => handleDietaryChange('vegetarian', !!checked)}
                />
                <Label htmlFor="vegetarian" className="cursor-pointer">Vegetariano</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="vegan" 
                  checked={userData.dietaryRestrictions?.vegan || false} 
                  onCheckedChange={(checked) => handleDietaryChange('vegan', !!checked)}
                />
                <Label htmlFor="vegan" className="cursor-pointer">Vegano</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherDietary">Altre restrizioni o allergie</Label>
              <Input 
                id="otherDietary" 
                value={userData.dietaryRestrictions?.other || ''} 
                onChange={(e) => handleDietaryChange('other', e.target.value as any)} 
                placeholder="Es: allergia alla frutta secca, ecc."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Notifiche e Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notificationsEnabled" 
                checked={userData.notificationsEnabled || false} 
                onCheckedChange={(checked) => setUserData(prev => ({ ...prev, notificationsEnabled: !!checked }))}
              />
              <Label htmlFor="notificationsEnabled" className="cursor-pointer">Desidero ricevere notifiche su novità e ristoranti</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="newsletter" 
                checked={userData.newsletter || false} 
                onCheckedChange={(checked) => setUserData(prev => ({ ...prev, newsletter: !!checked }))}
              />
              <Label htmlFor="newsletter" className="cursor-pointer">Iscrivimi alla newsletter</Label>
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

export default UserSettingsPage;
