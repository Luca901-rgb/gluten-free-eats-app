
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar, Clock, Info } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';

const BookingsStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  // Opzioni per la politica di cancellazione
  const cancellationOptions = [
    { value: '2hours', label: '2 ore prima' },
    { value: '6hours', label: '6 ore prima' },
    { value: '12hours', label: '12 ore prima' },
    { value: '24hours', label: '24 ore prima' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gestione Prenotazioni</h3>
        <p className="text-sm text-gray-500">
          Configura le opzioni per la prenotazione dei tavoli nel tuo ristorante.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="bookings.tables.lunch">Tavoli disponibili per il pranzo *</Label>
            <Input
              id="bookings.tables.lunch"
              type="number"
              min="0"
              {...register('bookings.tables.lunch', { 
                required: "Campo obbligatorio",
                valueAsNumber: true,
                min: { value: 0, message: "Il valore non può essere negativo" }
              })}
              placeholder="Es. 15"
            />
            {getNestedError(errors, 'bookings.tables.lunch') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'bookings.tables.lunch'))}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bookings.tables.dinner">Tavoli disponibili per la cena *</Label>
            <Input
              id="bookings.tables.dinner"
              type="number"
              min="0"
              {...register('bookings.tables.dinner', { 
                required: "Campo obbligatorio",
                valueAsNumber: true,
                min: { value: 0, message: "Il valore non può essere negativo" }
              })}
              placeholder="Es. 20"
            />
            {getNestedError(errors, 'bookings.tables.dinner') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'bookings.tables.dinner'))}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Politica di cancellazione *</Label>
          <p className="text-sm text-gray-500">
            Entro quanto tempo prima dell'orario di prenotazione è possibile cancellare senza penalità?
          </p>
          
          <RadioGroup
            defaultValue={watch('bookings.cancellationPolicy')}
            onValueChange={(value) => setValue('bookings.cancellationPolicy', value)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cancellationOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`cancel-${option.value}`} />
                  <Label htmlFor={`cancel-${option.value}`} className="cursor-pointer flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Informazioni sulla gestione delle prenotazioni</p>
              <p className="text-sm text-blue-700 mt-1">
                Le prenotazioni saranno gestibili tramite il pannello di amministrazione del ristorante. 
                Riceverai email e notifiche per ogni nuova prenotazione.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsStep;
