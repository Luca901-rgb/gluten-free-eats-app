
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Utensils, 
  Check,
  RadioTower, 
  ParkingMeter, 
  Wifi, 
  AirVent, 
  Accessibility, 
  Dog, 
  CreditCard,
  Package
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';

const FeaturesStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const restaurantTypes = [
    { value: 'ristorante', label: 'Ristorante' },
    { value: 'pizzeria', label: 'Pizzeria' },
    { value: 'trattoria', label: 'Trattoria' },
    { value: 'osteria', label: 'Osteria' },
    { value: 'fastfood', label: 'Fast Food' },
    { value: 'pasticceria', label: 'Pasticceria' },
    { value: 'gelateria', label: 'Gelateria' },
    { value: 'altro', label: 'Altro' },
  ];
  
  const services = [
    { value: 'parking', label: 'Parcheggio', icon: ParkingMeter },
    { value: 'outdoor', label: 'Dehors/spazio all\'aperto', icon: RadioTower },
    { value: 'accessibility', label: 'Accessibilità disabili', icon: Accessibility },
    { value: 'pets', label: 'Accettazione animali', icon: Dog },
    { value: 'wifi', label: 'Wi-Fi gratuito', icon: Wifi },
    { value: 'airConditioning', label: 'Aria condizionata', icon: AirVent },
    { value: 'cardPayment', label: 'Pagamento con carta', icon: CreditCard },
    { value: 'takeAway', label: 'Possibilità di asporto', icon: Package },
  ];

  const handleTypeChange = (value: string) => {
    setValue('features.type', value);
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const currentServices = watch('features.services') || [];
    
    if (checked) {
      setValue('features.services', [...currentServices, service]);
    } else {
      setValue('features.services', currentServices.filter((s: string) => s !== service));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Caratteristiche e Servizi</h3>
        <p className="text-sm text-gray-500">
          Indica il tipo di attività e i servizi disponibili nel tuo locale.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Tipologia Attività *</Label>
          <RadioGroup
            defaultValue={watch('features.type')}
            onValueChange={handleTypeChange}
            className="grid grid-cols-2 md:grid-cols-4 gap-2"
          >
            {restaurantTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <RadioGroupItem value={type.value} id={`type-${type.value}`} />
                <Label htmlFor={`type-${type.value}`} className="cursor-pointer">{type.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {watch('features.type') === 'altro' && (
            <Input
              placeholder="Specifica tipologia"
              {...register('features.otherType')}
              className="mt-2"
            />
          )}
          {getNestedError(errors, 'features.type') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'features.type'))}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Servizi Disponibili</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div key={service.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service.value}`}
                    checked={watch('features.services')?.includes(service.value)}
                    onCheckedChange={(checked) => handleServiceChange(service.value, !!checked)}
                  />
                  <Label htmlFor={`service-${service.value}`} className="cursor-pointer flex items-center gap-2">
                    <ServiceIcon className="h-4 w-4 text-gray-600" />
                    {service.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="space-y-2">
            <Label htmlFor="features.hasGlutenFreeOptions" className="flex items-center space-x-2">
              <Checkbox
                id="features.hasGlutenFreeOptions"
                checked={watch('features.hasGlutenFreeOptions')}
                onCheckedChange={(checked) => setValue('features.hasGlutenFreeOptions', !!checked)}
              />
              <span>Il nostro ristorante offre un menù per celiaci (Senza glutine)</span>
            </Label>
            <p className="text-sm text-green-700">
              Segnalando questa opzione, il tuo ristorante sarà evidenziato nella ricerca per i clienti celiaci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesStep;
