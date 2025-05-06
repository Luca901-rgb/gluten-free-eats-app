
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock, Calendar, CreditCard } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';

const BookingsStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const requiresDeposit = watch('bookings.requiresDeposit');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Gestione Prenotazioni</h3>
        <p className="text-sm text-gray-500">
          Configura le opzioni di prenotazione per il tuo ristorante.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bookings.tables.lunch">Tavoli disponibili a pranzo *</Label>
            <div className="relative">
              <Input
                id="bookings.tables.lunch"
                type="number"
                min="0"
                className="pl-10"
                {...register('bookings.tables.lunch', {
                  required: "Campo obbligatorio",
                  min: {
                    value: 0,
                    message: "Il valore deve essere maggiore o uguale a 0"
                  }
                })}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
            {getNestedError(errors, 'bookings.tables.lunch') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'bookings.tables.lunch'))}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bookings.tables.dinner">Tavoli disponibili a cena *</Label>
            <div className="relative">
              <Input
                id="bookings.tables.dinner"
                type="number"
                min="0"
                className="pl-10"
                {...register('bookings.tables.dinner', {
                  required: "Campo obbligatorio",
                  min: {
                    value: 0,
                    message: "Il valore deve essere maggiore o uguale a 0"
                  }
                })}
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
            {getNestedError(errors, 'bookings.tables.dinner') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'bookings.tables.dinner'))}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Politica di cancellazione *</Label>
          <RadioGroup
            defaultValue={watch('bookings.cancellationPolicy')}
            onValueChange={(value) => setValue('bookings.cancellationPolicy', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1hour" id="policy-1hour" />
              <Label htmlFor="policy-1hour">Entro 1 ora dalla prenotazione</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2hours" id="policy-2hours" />
              <Label htmlFor="policy-2hours">Entro 2 ore dalla prenotazione</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4hours" id="policy-4hours" />
              <Label htmlFor="policy-4hours">Entro 4 ore dalla prenotazione</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24hours" id="policy-24hours" />
              <Label htmlFor="policy-24hours">Entro 24 ore dalla prenotazione</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bookings.requiresDeposit"
              checked={requiresDeposit}
              onCheckedChange={(checked) => setValue('bookings.requiresDeposit', !!checked)}
            />
            <Label htmlFor="bookings.requiresDeposit" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
              <span>Richiedi caparra per confermare la prenotazione</span>
            </Label>
          </div>
          
          {requiresDeposit && (
            <div className="pl-8 space-y-2">
              <Label htmlFor="bookings.depositAmount">Importo caparra (€ per persona)</Label>
              <Input
                id="bookings.depositAmount"
                type="number"
                min="1"
                step="0.5"
                {...register('bookings.depositAmount', {
                  min: {
                    value: 1,
                    message: "L'importo deve essere almeno 1€"
                  }
                })}
              />
              {getNestedError(errors, 'bookings.depositAmount') && (
                <p className="text-sm text-red-500 mt-1">
                  {getErrorMessage(getNestedError(errors, 'bookings.depositAmount'))}
                </p>
              )}
              <p className="text-xs text-gray-500">
                La caparra verrà addebitata solo in caso di mancata presentazione o cancellazione tardiva.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsStep;
