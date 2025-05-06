
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock, DollarSign } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';

const OperationsStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const daysOfWeek = [
    { id: 'monday', label: 'Lunedì' },
    { id: 'tuesday', label: 'Martedì' },
    { id: 'wednesday', label: 'Mercoledì' },
    { id: 'thursday', label: 'Giovedì' },
    { id: 'friday', label: 'Venerdì' },
    { id: 'saturday', label: 'Sabato' },
    { id: 'sunday', label: 'Domenica' }
  ];

  const handlePriceRangeChange = (value: string) => {
    setValue('operations.priceRange', value);
  };

  const handleDayOpenChange = (day: string, isOpen: boolean) => {
    setValue(`operations.openingHours.${day}.open`, isOpen);
  };

  const handleTimeChange = (day: string, shiftIndex: number, field: 'from' | 'to', value: string) => {
    setValue(`operations.openingHours.${day}.shifts.${shiftIndex}.${field}`, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dettagli Operativi</h3>
        <p className="text-sm text-gray-500">
          Imposta gli orari di apertura e altre informazioni operative.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Orari di Apertura</Label>
          <div className="border rounded-md p-4 space-y-4">
            {daysOfWeek.map((day) => {
              const isOpen = watch(`operations.openingHours.${day.id}.open`);
              
              return (
                <div key={day.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Checkbox
                        checked={isOpen}
                        onCheckedChange={(checked) => handleDayOpenChange(day.id, !!checked)}
                        id={`day-${day.id}`}
                      />
                      <span>{day.label}</span>
                    </Label>
                    <span className="text-sm text-gray-500">{isOpen ? 'Aperto' : 'Chiuso'}</span>
                  </div>
                  
                  {isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500">Pranzo</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`${day.id}-lunch-from`} className="text-xs">Dalle</Label>
                            <Input
                              id={`${day.id}-lunch-from`}
                              type="time"
                              value={watch(`operations.openingHours.${day.id}.shifts.0.from`)}
                              onChange={(e) => handleTimeChange(day.id, 0, 'from', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day.id}-lunch-to`} className="text-xs">Alle</Label>
                            <Input
                              id={`${day.id}-lunch-to`}
                              type="time"
                              value={watch(`operations.openingHours.${day.id}.shifts.0.to`)}
                              onChange={(e) => handleTimeChange(day.id, 0, 'to', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-500">Cena</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`${day.id}-dinner-from`} className="text-xs">Dalle</Label>
                            <Input
                              id={`${day.id}-dinner-from`}
                              type="time"
                              value={watch(`operations.openingHours.${day.id}.shifts.1.from`)}
                              onChange={(e) => handleTimeChange(day.id, 1, 'from', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day.id}-dinner-to`} className="text-xs">Alle</Label>
                            <Input
                              id={`${day.id}-dinner-to`}
                              type="time"
                              value={watch(`operations.openingHours.${day.id}.shifts.1.to`)}
                              onChange={(e) => handleTimeChange(day.id, 1, 'to', e.target.value)}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="operations.priceRange">Fascia di Prezzo *</Label>
            <Select onValueChange={handlePriceRangeChange} defaultValue={watch('operations.priceRange')}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona fascia di prezzo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="€">€ - Economico</SelectItem>
                <SelectItem value="€€">€€ - Nella media</SelectItem>
                <SelectItem value="€€€">€€€ - Costoso</SelectItem>
                <SelectItem value="€€€€">€€€€ - Lusso</SelectItem>
              </SelectContent>
            </Select>
            {getNestedError(errors, 'operations.priceRange') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'operations.priceRange'))}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operations.capacity">Numero Coperti Totali *</Label>
            <div className="relative">
              <Input
                id="operations.capacity"
                type="number"
                min="1"
                className="pl-10"
                {...register('operations.capacity', {
                  required: "Campo obbligatorio",
                  min: {
                    value: 1,
                    message: "Il valore deve essere maggiore di 0"
                  }
                })}
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
            {getNestedError(errors, 'operations.capacity') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'operations.capacity'))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsStep;
