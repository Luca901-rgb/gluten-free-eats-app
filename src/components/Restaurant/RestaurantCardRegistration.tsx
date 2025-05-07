
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

const RestaurantCardRegistration = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'type' | 'review'>('info');
  
  const [formData, setFormData] = useState({
    name: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast.error("Per favore, accetta i termini e condizioni");
      return;
    }
    
    // Salva i dati del ristorante in localStorage per la demo
    localStorage.setItem('restaurantInfo', JSON.stringify({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      type: formData.type === 'altro' ? formData.otherType : formData.type,
      hasGlutenFreeOptions: formData.hasGlutenFreeOptions
    }));
    
    toast.success("Informazioni ristorante salvate con successo");
    onComplete();
  };
  
  const renderInfoForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome ristorante *</Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Es. La Trattoria di Mario"
            required
            className="pl-10"
          />
          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Indirizzo *</Label>
        <div className="relative">
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Es. Via Roma 123"
            required
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">Città *</Label>
        <Input
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Es. Milano"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefono *</Label>
        <div className="relative">
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Es. 02 1234567"
            required
            className="pl-10"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Es. info@ristorantedimarilo.it"
            required
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Sito web (opzionale)</Label>
        <div className="relative">
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Es. www.ristorantedimario.it"
            className="pl-10"
          />
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <Button 
        onClick={() => setStep('type')} 
        className="w-full mt-4"
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
        >
          Indietro
        </Button>
        <Button 
          onClick={() => setStep('review')} 
          className="flex-1"
        >
          Continua
        </Button>
      </div>
    </div>
  );
  
  const renderReviewForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Riepilogo informazioni</h3>
        
        <div className="bg-gray-50 rounded-md p-4 space-y-3">
          <div>
            <span className="font-medium">Nome:</span> {formData.name}
          </div>
          <div>
            <span className="font-medium">Indirizzo:</span> {formData.address}, {formData.city}
          </div>
          <div>
            <span className="font-medium">Contatti:</span> {formData.phone}, {formData.email}
          </div>
          {formData.website && (
            <div>
              <span className="font-medium">Sito web:</span> {formData.website}
            </div>
          )}
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
            Verificare che tutti i dati inseriti siano corretti. Puoi sempre modificarli in seguito dalla dashboard del tuo ristorante.
          </p>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={() => setStep('type')} 
          className="flex-1"
        >
          Indietro
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="flex-1"
        >
          Completa registrazione
        </Button>
      </div>
    </div>
  );
  
  const renderStepContent = () => {
    switch (step) {
      case 'info':
        return renderInfoForm();
      case 'type':
        return renderTypeForm();
      case 'review':
        return renderReviewForm();
      default:
        return renderInfoForm();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registrazione Ristorante</CardTitle>
        <CardDescription>
          Inserisci i dati del tuo ristorante per iniziare
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
