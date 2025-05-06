
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Store, MapPin, Mail, Phone, Globe, Building } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';

const RestaurantInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dati Principali del Ristorante</h3>
        <p className="text-sm text-gray-500">
          Inserisci le informazioni principali del tuo ristorante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="restaurant.name">Nome Commerciale *</Label>
          <div className="relative">
            <Input
              id="restaurant.name"
              placeholder="Nome del ristorante"
              className="pl-10"
              {...register('restaurant.name', { required: "Campo obbligatorio" })}
            />
            <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {getNestedError(errors, 'restaurant.name') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'restaurant.name'))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant.address">Indirizzo *</Label>
          <div className="relative">
            <Input
              id="restaurant.address"
              placeholder="Via e numero civico"
              className="pl-10"
              {...register('restaurant.address', { required: "Campo obbligatorio" })}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {getNestedError(errors, 'restaurant.address') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'restaurant.address'))}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant.zipCode">CAP *</Label>
            <Input
              id="restaurant.zipCode"
              placeholder="00100"
              {...register('restaurant.zipCode', { required: "Obbligatorio" })}
            />
            {getNestedError(errors, 'restaurant.zipCode') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'restaurant.zipCode'))}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restaurant.city">Città *</Label>
            <Input
              id="restaurant.city"
              placeholder="Roma"
              {...register('restaurant.city', { required: "Obbligatorio" })}
            />
            {getNestedError(errors, 'restaurant.city') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'restaurant.city'))}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restaurant.province">Provincia *</Label>
            <Input
              id="restaurant.province"
              placeholder="RM"
              {...register('restaurant.province', { required: "Obbligatorio" })}
            />
            {getNestedError(errors, 'restaurant.province') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'restaurant.province'))}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant.email">Email del Ristorante *</Label>
          <div className="relative">
            <Input
              id="restaurant.email"
              type="email"
              placeholder="ristorante@email.com"
              className="pl-10"
              {...register('restaurant.email', {
                required: "Campo obbligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Indirizzo email non valido"
                }
              })}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {getNestedError(errors, 'restaurant.email') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'restaurant.email'))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant.phone">Telefono del Ristorante *</Label>
          <div className="relative">
            <Input
              id="restaurant.phone"
              placeholder="+39 123 456 7890"
              className="pl-10"
              {...register('restaurant.phone', { required: "Campo obbligatorio" })}
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {getNestedError(errors, 'restaurant.phone') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'restaurant.phone'))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant.website">Sito Web (opzionale)</Label>
          <div className="relative">
            <Input
              id="restaurant.website"
              placeholder="www.iltuoristorante.it"
              className="pl-10"
              {...register('restaurant.website')}
            />
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant.taxId">Partita IVA / Codice Fiscale *</Label>
          <div className="relative">
            <Input
              id="restaurant.taxId"
              placeholder="IT12345678901"
              className="pl-10"
              {...register('restaurant.taxId', { required: "Campo obbligatorio" })}
            />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
          {getNestedError(errors, 'restaurant.taxId') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'restaurant.taxId'))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfoStep;
