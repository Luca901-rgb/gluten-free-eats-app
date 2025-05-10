
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Store, MapPin, Phone, Mail, Globe, Info, Check } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import safeStorage from '@/lib/safeStorage';

// STEP 1: Solo raccogliamo le informazioni principali del manager
const RestaurantCardRegistration = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'type' | 'review'>('info');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    managerPassword: '',
    confirmPassword: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    type: '',
    otherType: '',
    hasGlutenFreeOptions: true,
    acceptTerms: false
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

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
      otherType: value === 'altro' ? formData.otherType : '',
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validateForm = () => {
    // Valida i campi obbligatori nel primo step
    if (step === 'info') {
      if (!formData.managerName) {
        toast.error("Inserisci il nome del gestore");
        return false;
      }
      if (!formData.managerEmail) {
        toast.error("Inserisci l'email del gestore");
        return false;
      }
      if (!formData.managerPassword) {
        toast.error("Inserisci la password");
        return false;
      }
      if (formData.managerPassword !== formData.confirmPassword) {
        toast.error("Le password non corrispondono");
        return false;
      }
    }

    if (step === 'type') {
      if (!formData.type) {
        toast.error("Seleziona la tipologia di attività");
        return false;
      }
      if (formData.type === 'altro' && !formData.otherType) {
        toast.error("Specifica la tipologia dell'attività");
        return false;
      }
      if (!formData.acceptTerms) {
        toast.error("Accetta i termini e condizioni per continuare");
        return false;
      }
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (!validateForm()) return;
    
    if (step === 'info') {
      setStep('type');
    } else if (step === 'type') {
      setStep('review');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!formData.acceptTerms) {
      toast.error("Per favore, accetta i termini e condizioni");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Registrazione dell'utente con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.managerEmail, 
        formData.managerPassword
      );
      
      const user = userCredential.user;
      
      // Salva i dati principali in localStorage
      safeStorage.setItem('userType', 'restaurant');
      safeStorage.setItem('isAuthenticated', 'true');
      safeStorage.setItem('userId', user.uid);
      safeStorage.setItem('userEmail', formData.managerEmail);
      safeStorage.setItem('userName', formData.managerName);
      safeStorage.setItem('isRestaurantOwner', 'true');
      
      // Salva i dati del primo step per il form di registrazione completo
      const initialRestaurantData = {
        manager: {
          name: formData.managerName,
          email: formData.managerEmail,
          phone: formData.managerPhone,
          password: formData.managerPassword,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms
        },
        features: {
          type: formData.type === 'altro' ? formData.otherType : formData.type,
          services: [],
          hasGlutenFreeOptions: formData.hasGlutenFreeOptions
        }
      };
      
      // Salva lo stato iniziale del form di registrazione completa
      safeStorage.setItem('initialRestaurantData', JSON.stringify(initialRestaurantData));
      
      toast.success("Registrazione preliminare completata con successo");
      
      // Passa la chiamata al parent component
      onComplete();
      
      // Reindirizza alla pagina di registrazione completa
      navigate('/restaurant-registration');
    } catch (error: any) {
      console.error("Errore durante la registrazione:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error("L'indirizzo email è già in uso");
      } else {
        toast.error(`Errore durante la registrazione: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderManagerInfoForm = () => (
    <div className="space-y-5">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="text-blue-700 font-medium mb-2">Dati gestore</h3>
        <p className="text-blue-600 text-sm">
          Inserisci i tuoi dati personali per creare l'account di gestione del ristorante.
          Nella prossima fase inserirai le informazioni complete sul tuo locale.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="managerName">Nome completo *</Label>
          <div className="relative">
            <Input
              id="managerName"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              placeholder="Es. Mario Rossi"
              required
              className="pl-10"
            />
            <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="managerEmail">Email *</Label>
          <div className="relative">
            <Input
              id="managerEmail"
              name="managerEmail"
              type="email"
              value={formData.managerEmail}
              onChange={handleChange}
              placeholder="Es. mario.rossi@email.com"
              required
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="managerPhone">Telefono *</Label>
          <div className="relative">
            <Input
              id="managerPhone"
              name="managerPhone"
              value={formData.managerPhone}
              onChange={handleChange}
              placeholder="Es. +39 123 456 7890"
              required
              className="pl-10"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="managerPassword">Password *</Label>
          <Input
            id="managerPassword"
            name="managerPassword"
            type="password"
            value={formData.managerPassword}
            onChange={handleChange}
            placeholder="Inserisci password"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Conferma Password *</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Conferma password"
            required
          />
          {formData.managerPassword && formData.confirmPassword && 
           formData.managerPassword !== formData.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Le password non corrispondono</p>
          )}
        </div>
      </div>
      
      <Button 
        onClick={handleNextStep}
        className="w-full mt-4"
        disabled={isLoading}
      >
        Continua
      </Button>
    </div>
  );
  
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
  
  const renderTypeForm = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="text-blue-700 font-medium mb-2">Tipologia attività</h3>
        <p className="text-blue-600 text-sm">
          Seleziona la tipologia del tuo locale. Queste informazioni saranno visibili ai clienti e saranno usate per migliorare la ricerca.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Tipologia Attività *</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={handleTypeChange}
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {restaurantTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={`type-${type.value}`} />
              <Label htmlFor={`type-${type.value}`} className="cursor-pointer">{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {formData.type === 'altro' && (
          <Input
            name="otherType"
            value={formData.otherType}
            onChange={handleChange}
            placeholder="Specifica tipologia"
            className="mt-2"
          />
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start space-x-3">
        <Check className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="space-y-2">
          <Label htmlFor="hasGlutenFreeOptions" className="flex items-center space-x-2">
            <Checkbox
              id="hasGlutenFreeOptions"
              checked={formData.hasGlutenFreeOptions}
              onCheckedChange={(checked) => handleCheckboxChange('hasGlutenFreeOptions', !!checked)}
            />
            <span>Il nostro ristorante offre un menù per celiaci (Senza glutine)</span>
          </Label>
          <p className="text-sm text-green-700">
            Segnalando questa opzione, il tuo ristorante sarà evidenziato nella ricerca per i clienti celiaci.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="acceptTerms" 
          checked={formData.acceptTerms} 
          onCheckedChange={(checked) => handleCheckboxChange('acceptTerms', !!checked)}
        />
        <Label 
          htmlFor="acceptTerms" 
          className="text-sm cursor-pointer"
        >
          Accetto i termini e condizioni e la privacy policy
        </Label>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={() => setStep('info')} 
          className="flex-1"
          disabled={isLoading}
        >
          Indietro
        </Button>
        <Button 
          onClick={handleNextStep}
          className="flex-1"
          disabled={isLoading}
        >
          Continua
        </Button>
      </div>
    </div>
  );
  
  const renderReviewForm = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="text-blue-700 font-medium mb-2">Conferma dati</h3>
        <p className="text-blue-600 text-sm">
          Verifica che i dati inseriti siano corretti. Nella prossima fase completerai la registrazione del tuo ristorante.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Riepilogo informazioni</h3>
        
        <div className="bg-gray-50 rounded-md p-4 space-y-3">
          <div>
            <span className="font-medium">Nome gestore:</span> {formData.managerName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {formData.managerEmail}
          </div>
          <div>
            <span className="font-medium">Telefono:</span> {formData.managerPhone}
          </div>
          <div>
            <span className="font-medium">Tipologia:</span> {formData.type === 'altro' ? formData.otherType : restaurantTypes.find(t => t.value === formData.type)?.label}
          </div>
          <div>
            <span className="font-medium">Opzioni senza glutine:</span> {formData.hasGlutenFreeOptions ? 'Sì' : 'No'}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-700">
            Cliccando su "Completa registrazione" passerai alla fase successiva dove potrai inserire tutti i dettagli del tuo ristorante.
          </p>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={() => setStep('type')} 
          className="flex-1"
          disabled={isLoading}
        >
          Indietro
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Elaborazione...' : 'Completa registrazione'}
        </Button>
      </div>
    </div>
  );
  
  const renderStepContent = () => {
    switch (step) {
      case 'info':
        return renderManagerInfoForm();
      case 'type':
        return renderTypeForm();
      case 'review':
        return renderReviewForm();
      default:
        return renderManagerInfoForm();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrazione Ristorante</CardTitle>
        <CardDescription>
          Inserisci i dati del gestore per iniziare
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
