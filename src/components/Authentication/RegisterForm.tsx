import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone, MapPin, Store, Globe, AlignLeft } from 'lucide-react';
import { registerUser, signInWithGoogle } from '@/lib/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Clock } from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cardRegistered, setCardRegistered] = useState(false);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    restaurantName: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    restaurantType: '',
    otherType: '',
    priceRange: '',
    openingHours: {
      monday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      tuesday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      wednesday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      thursday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      friday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      saturday: { open: true, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
      sunday: { open: false, from: '12:00', to: '15:00', fromDinner: '19:00', toDinner: '23:00' },
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOpeningHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day as keyof typeof formData.openingHours],
          [field]: value
        }
      }
    });
  };

  const handlePaymentComplete = (success: boolean) => {
    setShowPaymentDialog(false);
    if (success) {
      setCardRegistered(true);
      toast.success("Registrazione completata con successo");
      
      completeRegistration();
    } else {
      toast.error("Registrazione non riuscita");
    }
  };

  const completeRegistration = async () => {
    try {
      const user = await registerUser(formData.email, formData.password);
      
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userId', user.uid);
      
      if (formData.phone) {
        localStorage.setItem('userPhone', formData.phone);
      }
      if (formData.address) {
        localStorage.setItem('userAddress', formData.address);
      }
      
      if (userType === 'restaurant') {
        localStorage.setItem('restaurantName', formData.restaurantName);
        localStorage.setItem('restaurantAddress', formData.address);
        localStorage.setItem('restaurantPhone', formData.phone);
        localStorage.setItem('restaurantWebsite', formData.website || '');
        localStorage.setItem('restaurantDescription', formData.description || '');
        localStorage.setItem('restaurantType', formData.restaurantType || '');
        localStorage.setItem('restaurantPriceRange', formData.priceRange || '');
        navigate('/restaurant-dashboard');
      } else {
        navigate('/');
      }
      
      toast.success("Registrazione effettuata con successo");
    } catch (error: any) {
      toast.error(`Errore durante la registrazione: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Le password non corrispondono");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Accetta i termini e condizioni per continuare");
      return;
    }

    setIsLoading(true);

    await completeRegistration();
  };

  const handleGoogleSignIn = async () => {
    if (!formData.acceptTerms) {
      toast.error("Accetta i termini e le condizioni per continuare");
      return;
    }
    
    setIsLoading(true);
    toast.loading("Connessione a Google in corso...");
    
    try {
      console.log("Avvio autenticazione Google dal form");
      const user = await signInWithGoogle();
      console.log("Dati utente ricevuti:", user);
      
      if (!user || !user.uid) {
        throw new Error("Dati utente non validi o incompleti");
      }
      
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.displayName || '');
      localStorage.setItem('userId', user.uid);
      
      console.log("Dati salvati in localStorage:", {
        userType,
        email: user.email,
        name: user.displayName,
        uid: user.uid
      });
      
      toast.success("Registrazione con Google completata! Reindirizzamento...");
      navigate('/');
      
      toast.success("Registrazione con Google effettuata con successo");
    } catch (error: any) {
      console.error("Errore di registrazione con Google:", error);
      toast.dismiss();
      toast.error(`Errore durante la registrazione con Google: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCustomerForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            placeholder="Mario Rossi"
            required
            value={formData.name}
            onChange={handleChange}
            className="pl-10"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nome@esempio.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 my-4">
        <Checkbox 
          id="acceptTerms" 
          name="acceptTerms" 
          checked={formData.acceptTerms} 
          onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
        />
        <label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accetto i termini e le condizioni
        </label>
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? 'Registrazione in corso...' : 'Registrati come cliente'}
      </Button>
      
      <div className="relative flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600 text-sm">oppure</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
        </svg>
        Registrati con Google
      </Button>
    </form>
  );

  const days = [
    { id: 'monday', label: 'Lunedì' },
    { id: 'tuesday', label: 'Martedì' },
    { id: 'wednesday', label: 'Mercoledì' },
    { id: 'thursday', label: 'Giovedì' },
    { id: 'friday', label: 'Venerdì' },
    { id: 'saturday', label: 'Sabato' },
    { id: 'sunday', label: 'Domenica' },
  ];

  const restaurantTypes = [
    { value: 'ristorante', label: 'Ristorante' },
    { value: 'pizzeria', label: 'Pizzeria' },
    { value: 'trattoria', label: 'Trattoria' },
    { value: 'osteria', label: 'Osteria' },
    { value: 'pub', label: 'Pub/Birreria' },
    { value: 'fastfood', label: 'Fast Food' },
    { value: 'pasticceria', label: 'Pasticceria' },
    { value: 'gelateria', label: 'Gelateria' },
    { value: 'altro', label: 'Altro' },
  ];

  const renderRestaurantForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome proprietario</Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            placeholder="Mario Rossi"
            required
            value={formData.name}
            onChange={handleChange}
            className="pl-10"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="restaurantName">Nome ristorante</Label>
        <div className="relative">
          <Input
            id="restaurantName"
            name="restaurantName"
            placeholder="Il Ristorante Senza Glutine"
            required
            value={formData.restaurantName}
            onChange={handleChange}
            className="pl-10"
          />
          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Indirizzo</Label>
        <div className="relative">
          <Input
            id="address"
            name="address"
            placeholder="Via Roma 123, Milano"
            required
            value={formData.address}
            onChange={handleChange}
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefono</Label>
        <div className="relative">
          <Input
            id="phone"
            name="phone"
            placeholder="+39 123 4567890"
            required
            value={formData.phone}
            onChange={handleChange}
            className="pl-10"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Sito Web</Label>
        <div className="relative">
          <Input
            id="website"
            name="website"
            placeholder="www.ristorantesenzaglutine.it"
            value={formData.website}
            onChange={handleChange}
            className="pl-10"
          />
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="restaurantType">Tipo di ristorante</Label>
          <Select value={formData.restaurantType} onValueChange={(value) => handleSelectChange('restaurantType', value)}>
            <SelectTrigger id="restaurantType">
              <SelectValue placeholder="Seleziona tipo di ristorante" />
            </SelectTrigger>
            <SelectContent>
              {restaurantTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.restaurantType === 'altro' && (
            <Input
              placeholder="Specifica tipologia"
              name="otherType"
              value={formData.otherType}
              onChange={handleChange}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceRange">Fascia di prezzo</Label>
          <Select value={formData.priceRange} onValueChange={(value) => handleSelectChange('priceRange', value)}>
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
        <Label htmlFor="description">Descrizione del ristorante</Label>
        <div className="relative">
          <Textarea
            id="description"
            name="description"
            placeholder="Descrivi il tuo ristorante, specialità, servizi..."
            value={formData.description}
            onChange={handleChange}
            className="min-h-[100px] pl-10 pt-8"
          />
          <AlignLeft className="absolute left-3 top-3 text-gray-500" size={18} />
        </div>
      </div>

      <div className="mt-6">
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <Clock size={16} />
                <span>Imposta orari di apertura</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Orari di Apertura</DrawerTitle>
                <DrawerDescription>
                  Imposta gli orari di apertura del tuo ristorante
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {days.map((day) => {
                  const dayData = formData.openingHours[day.id as keyof typeof formData.openingHours];
                  return (
                    <div key={day.id} className="border-b border-gray-200 py-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-3">
                        <Label htmlFor={`open-${day.id}`} className="text-base font-medium">{day.label}</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`open-${day.id}`}
                            checked={dayData.open}
                            onCheckedChange={(checked) => 
                              handleOpeningHoursChange(day.id, 'open', !!checked)
                            }
                          />
                          <Label htmlFor={`open-${day.id}`} className="cursor-pointer">
                            {dayData.open ? "Aperto" : "Chiuso"}
                          </Label>
                        </div>
                      </div>
                      
                      {dayData.open && (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">Pranzo</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`${day.id}-lunch-from`} className="text-xs">Dalle</Label>
                                <Input
                                  id={`${day.id}-lunch-from`}
                                  type="time"
                                  value={dayData.from}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'from', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${day.id}-lunch-to`} className="text-xs">Alle</Label>
                                <Input
                                  id={`${day.id}-lunch-to`}
                                  type="time"
                                  value={dayData.to}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'to', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">Cena</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`${day.id}-dinner-from`} className="text-xs">Dalle</Label>
                                <Input
                                  id={`${day.id}-dinner-from`}
                                  type="time"
                                  value={dayData.fromDinner}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'fromDinner', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${day.id}-dinner-to`} className="text-xs">Alle</Label>
                                <Input
                                  id={`${day.id}-dinner-to`}
                                  type="time"
                                  value={dayData.toDinner}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'toDinner', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Salva orari</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={showMoreFields} onOpenChange={setShowMoreFields}>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => setShowMoreFields(true)}
            >
              <Clock size={16} />
              <span>Imposta orari di apertura</span>
            </Button>
            <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Orari di Apertura</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-5">
                {days.map((day) => {
                  const dayData = formData.openingHours[day.id as keyof typeof formData.openingHours];
                  return (
                    <div key={day.id} className="border-b border-gray-200 pb-5 last:border-b-0">
                      <div className="flex justify-between items-center mb-3">
                        <Label htmlFor={`open-${day.id}`} className="text-base font-medium">{day.label}</Label>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`open-${day.id}`}
                            checked={dayData.open}
                            onCheckedChange={(checked) => 
                              handleOpeningHoursChange(day.id, 'open', !!checked)
                            }
                          />
                          <Label htmlFor={`open-${day.id}`} className="cursor-pointer">
                            {dayData.open ? "Aperto" : "Chiuso"}
                          </Label>
                        </div>
                      </div>
                      
                      {dayData.open && (
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">Pranzo</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`${day.id}-lunch-from`} className="text-xs">Dalle</Label>
                                <Input
                                  id={`${day.id}-lunch-from`}
                                  type="time"
                                  value={dayData.from}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'from', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${day.id}-lunch-to`} className="text-xs">Alle</Label>
                                <Input
                                  id={`${day.id}-lunch-to`}
                                  type="time"
                                  value={dayData.to}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'to', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-500">Cena</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`${day.id}-dinner-from`} className="text-xs">Dalle</Label>
                                <Input
                                  id={`${day.id}-dinner-from`}
                                  type="time"
                                  value={dayData.fromDinner}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'fromDinner', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${day.id}-dinner-to`} className="text-xs">Alle</Label>
                                <Input
                                  id={`${day.id}-dinner-to`}
                                  type="time"
                                  value={dayData.toDinner}
                                  onChange={(e) => handleOpeningHoursChange(day.id, 'toDinner', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setShowMoreFields(false)}>Salva orari</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ristorante@esempio.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 my-4">
        <Checkbox 
          id="acceptTerms" 
          name="acceptTerms" 
          checked={formData.acceptTerms} 
          onCheckedChange={(checked) => setFormData({...formData, acceptTerms: !!checked})}
        />
        <label
          htmlFor="acceptTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accetto i termini e le condizioni
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90" 
        disabled={isLoading}
      >
        {isLoading ? 'Registrazione in corso...' : 'Completa registrazione'}
      </Button>
      
      <div className="relative flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600 text-sm">oppure</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 13
