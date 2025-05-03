import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, User, Phone, MapPin, Calendar, Mail, Info, Wheat, Briefcase, FileText, Shield, Star, Image } from 'lucide-react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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
  // Campi aggiuntivi dalla registrazione
  profession?: string;
  bio?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    website?: string;
  };
  preferredCuisine?: string[];
  allergyDocuments?: string[];
  avatarUrl?: string;
  certificationType?: string;
  certificationNumber?: string;
  memberSince?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacySettings?: {
    showProfile?: boolean;
    showReviews?: boolean;
    showBookings?: boolean;
  };
  reviews?: number;
  rating?: number;
  badgeLevel?: string;
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
    notificationsEnabled: localStorage.getItem('userNotifications') === 'true' || true,
    // Campi aggiuntivi dalla registrazione
    profession: localStorage.getItem('userProfession') || '',
    bio: localStorage.getItem('userBio') || '',
    socialMediaLinks: {
      facebook: localStorage.getItem('userSocialFacebook') || '',
      instagram: localStorage.getItem('userSocialInstagram') || '',
      twitter: localStorage.getItem('userSocialTwitter') || '',
      tiktok: localStorage.getItem('userSocialTiktok') || '',
      website: localStorage.getItem('userSocialWebsite') || '',
    },
    preferredCuisine: localStorage.getItem('userPreferredCuisine') ? 
      JSON.parse(localStorage.getItem('userPreferredCuisine') || '[]') : 
      ['Italiana', 'Pizzeria'],
    certificationType: localStorage.getItem('userCertificationType') || 'AIC',
    certificationNumber: localStorage.getItem('userCertificationNumber') || '',
    avatarUrl: localStorage.getItem('userAvatarUrl') || '',
    memberSince: localStorage.getItem('userMemberSince') || new Date().toISOString().split('T')[0],
    notificationPreferences: {
      email: localStorage.getItem('userNotifEmail') === 'true' || true,
      push: localStorage.getItem('userNotifPush') === 'true' || true,
      sms: localStorage.getItem('userNotifSms') === 'true' || false,
    },
    privacySettings: {
      showProfile: localStorage.getItem('userPrivacyProfile') === 'true' || true,
      showReviews: localStorage.getItem('userPrivacyReviews') === 'true' || true,
      showBookings: localStorage.getItem('userPrivacyBookings') === 'true' || false,
    },
    reviews: parseInt(localStorage.getItem('userReviews') || '0'),
    rating: parseFloat(localStorage.getItem('userRating') || '0'),
    badgeLevel: localStorage.getItem('userBadgeLevel') || 'Principiante',
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
            // Campi aggiuntivi dalla registrazione
            profession: firestoreData.profession || current.profession,
            bio: firestoreData.bio || current.bio,
            socialMediaLinks: firestoreData.socialMediaLinks || current.socialMediaLinks,
            preferredCuisine: firestoreData.preferredCuisine || current.preferredCuisine,
            certificationType: firestoreData.certificationType || current.certificationType,
            certificationNumber: firestoreData.certificationNumber || current.certificationNumber,
            avatarUrl: firestoreData.avatarUrl || current.avatarUrl,
            memberSince: firestoreData.memberSince || current.memberSince,
            notificationPreferences: firestoreData.notificationPreferences || current.notificationPreferences,
            privacySettings: firestoreData.privacySettings || current.privacySettings,
            reviews: firestoreData.reviews || current.reviews,
            rating: firestoreData.rating || current.rating,
            badgeLevel: firestoreData.badgeLevel || current.badgeLevel,
          }));
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati utente:", err);
        // Continua con i dati del localStorage
      }
    };
    
    loadUserData();
  }, [navigate, userData.displayName, userData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSocialChange = (key: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      socialMediaLinks: {
        ...prev.socialMediaLinks,
        [key]: value
      }
    }));
  };

  const handleNotificationPrefChange = (key: string, value: boolean) => {
    setUserData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: value
      }
    }));
  };

  const handlePrivacySettingChange = (key: string, value: boolean) => {
    setUserData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [key]: value
      }
    }));
  };

  const handlePreferredCuisineChange = (cuisine: string) => {
    setUserData(prev => {
      const current = prev.preferredCuisine || [];
      if (current.includes(cuisine)) {
        return {
          ...prev,
          preferredCuisine: current.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          preferredCuisine: [...current, cuisine]
        };
      }
    });
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
      
      // Campi aggiuntivi dalla registrazione
      localStorage.setItem('userProfession', userData.profession || '');
      localStorage.setItem('userBio', userData.bio || '');
      localStorage.setItem('userSocialFacebook', userData.socialMediaLinks?.facebook || '');
      localStorage.setItem('userSocialInstagram', userData.socialMediaLinks?.instagram || '');
      localStorage.setItem('userSocialTwitter', userData.socialMediaLinks?.twitter || '');
      localStorage.setItem('userSocialTiktok', userData.socialMediaLinks?.tiktok || '');
      localStorage.setItem('userSocialWebsite', userData.socialMediaLinks?.website || '');
      localStorage.setItem('userPreferredCuisine', JSON.stringify(userData.preferredCuisine || []));
      localStorage.setItem('userCertificationType', userData.certificationType || '');
      localStorage.setItem('userCertificationNumber', userData.certificationNumber || '');
      localStorage.setItem('userAvatarUrl', userData.avatarUrl || '');
      localStorage.setItem('userMemberSince', userData.memberSince || '');
      localStorage.setItem('userNotifEmail', String(userData.notificationPreferences?.email || true));
      localStorage.setItem('userNotifPush', String(userData.notificationPreferences?.push || true));
      localStorage.setItem('userNotifSms', String(userData.notificationPreferences?.sms || false));
      localStorage.setItem('userPrivacyProfile', String(userData.privacySettings?.showProfile || true));
      localStorage.setItem('userPrivacyReviews', String(userData.privacySettings?.showReviews || true));
      localStorage.setItem('userPrivacyBookings', String(userData.privacySettings?.showBookings || false));
      localStorage.setItem('userReviews', String(userData.reviews || 0));
      localStorage.setItem('userRating', String(userData.rating || 0));
      localStorage.setItem('userBadgeLevel', userData.badgeLevel || 'Principiante');
      
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
          // Campi aggiuntivi dalla registrazione
          profession: userData.profession || '',
          bio: userData.bio || '',
          socialMediaLinks: userData.socialMediaLinks || {},
          preferredCuisine: userData.preferredCuisine || [],
          certificationType: userData.certificationType || '',
          certificationNumber: userData.certificationNumber || '',
          avatarUrl: userData.avatarUrl || '',
          memberSince: userData.memberSince || new Date().toISOString().split('T')[0],
          notificationPreferences: userData.notificationPreferences || {},
          privacySettings: userData.privacySettings || {},
          reviews: userData.reviews || 0,
          rating: userData.rating || 0,
          badgeLevel: userData.badgeLevel || 'Principiante',
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

  const cuisineOptions = [
    "Italiana", "Pizzeria", "Trattoria", "Pub", "Panineria", 
    "Campana", "Romana", "Toscana", "Siciliana", "Pugliese"
  ];

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dati Personali
            </CardTitle>

            {userData.avatarUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                <img 
                  src={userData.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="profession">Professione</Label>
                <div className="relative">
                  <Input 
                    id="profession" 
                    name="profession" 
                    value={userData.profession || ''} 
                    onChange={handleInputChange} 
                    placeholder="La tua professione"
                    className="pl-9"
                  />
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                name="bio"
                value={userData.bio || ''}
                onChange={handleInputChange}
                placeholder="Raccontaci qualcosa di te..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">URL Immagine Profilo</Label>
              <div className="relative">
                <Input 
                  id="avatarUrl" 
                  name="avatarUrl" 
                  value={userData.avatarUrl || ''} 
                  onChange={handleInputChange} 
                  placeholder="URL della tua immagine profilo"
                  className="pl-9"
                />
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
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

            <div className="space-y-2">
              <Label>Cucine preferite</Label>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map(cuisine => (
                  <Badge 
                    key={cuisine}
                    variant={userData.preferredCuisine?.includes(cuisine) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handlePreferredCuisineChange(cuisine)}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Certificazioni e Documenti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certificationType">Tipo certificazione</Label>
                <Select 
                  value={userData.certificationType || ''} 
                  onValueChange={(value) => setUserData(prev => ({ ...prev, certificationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AIC">AIC</SelectItem>
                    <SelectItem value="AFC">AFC</SelectItem>
                    <SelectItem value="Medical">Certificato Medico</SelectItem>
                    <SelectItem value="Self">Autocertificazione</SelectItem>
                    <SelectItem value="None">Nessuna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificationNumber">Numero certificazione</Label>
                <div className="relative">
                  <Input 
                    id="certificationNumber" 
                    name="certificationNumber" 
                    value={userData.certificationNumber || ''} 
                    onChange={handleInputChange} 
                    placeholder="Numero certificazione"
                    className="pl-9"
                  />
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Documenti caricati</Label>
              <p className="text-sm text-muted-foreground">
                Non sono presenti documenti caricati. Puoi caricare la tua certificazione medica o altri documenti relativi alla tua condizione.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Carica documento
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Attività e Badge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-semibold text-lg">{userData.reviews || 0}</h4>
                <p className="text-sm text-gray-500">Recensioni</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-semibold text-lg">{userData.rating || 0}</h4>
                <p className="text-sm text-gray-500">Valutazione</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-semibold text-lg">{userData.badgeLevel || 'Principiante'}</h4>
                <p className="text-sm text-gray-500">Livello</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h4 className="font-semibold text-lg">
                  {userData.memberSince ? 
                    new Date(userData.memberSince).toLocaleDateString('it-IT', {
                      year: 'numeric',
                      month: 'short'
                    }) :
                    'N/D'}
                </h4>
                <p className="text-sm text-gray-500">Membro dal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input 
                  id="facebook" 
                  value={userData.socialMediaLinks?.facebook || ''} 
                  onChange={(e) => handleSocialChange('facebook', e.target.value)} 
                  placeholder="URL profilo Facebook"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram" 
                  value={userData.socialMediaLinks?.instagram || ''} 
                  onChange={(e) => handleSocialChange('instagram', e.target.value)} 
                  placeholder="URL profilo Instagram"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input 
                  id="twitter" 
                  value={userData.socialMediaLinks?.twitter || ''} 
                  onChange={(e) => handleSocialChange('twitter', e.target.value)} 
                  placeholder="URL profilo Twitter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input 
                  id="tiktok" 
                  value={userData.socialMediaLinks?.tiktok || ''} 
                  onChange={(e) => handleSocialChange('tiktok', e.target.value)} 
                  placeholder="URL profilo TikTok"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Sito Web</Label>
                <Input 
                  id="website" 
                  value={userData.socialMediaLinks?.website || ''} 
                  onChange={(e) => handleSocialChange('website', e.target.value)} 
                  placeholder="URL del tuo sito web"
                />
              </div>
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
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Canali di notifica</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifEmail" 
                  checked={userData.notificationPreferences?.email || false} 
                  onCheckedChange={(checked) => handleNotificationPrefChange('email', !!checked)}
                />
                <Label htmlFor="notifEmail" className="cursor-pointer">Email</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifPush" 
                  checked={userData.notificationPreferences?.push || false} 
                  onCheckedChange={(checked) => handleNotificationPrefChange('push', !!checked)}
                />
                <Label htmlFor="notifPush" className="cursor-pointer">Notifiche push</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifSms" 
                  checked={userData.notificationPreferences?.sms || false} 
                  onCheckedChange={(checked) => handleNotificationPrefChange('sms', !!checked)}
                />
                <Label htmlFor="notifSms" className="cursor-pointer">SMS</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Privacy del profilo</h3>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacyProfile" 
                  checked={userData.privacySettings?.showProfile || false} 
                  onCheckedChange={(checked) => handlePrivacySettingChange('showProfile', !!checked)}
                />
                <Label htmlFor="privacyProfile" className="cursor-pointer">Mostra il mio profilo pubblicamente</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacyReviews" 
                  checked={userData.privacySettings?.showReviews || false} 
                  onCheckedChange={(checked) => handlePrivacySettingChange('showReviews', !!checked)}
                />
                <Label htmlFor="privacyReviews" className="cursor-pointer">Mostra le mie recensioni pubblicamente</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacyBookings" 
                  checked={userData.privacySettings?.showBookings || false} 
                  onCheckedChange={(checked) => handlePrivacySettingChange('showBookings', !!checked)}
                />
                <Label htmlFor="privacyBookings" className="cursor-pointer">Mostra le mie prenotazioni agli amici</Label>
              </div>
            </div>

            <Separator />

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
