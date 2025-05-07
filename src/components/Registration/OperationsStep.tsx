
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock, DollarSign, Plus, Trash } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';
import { Button } from '@/components/ui/button';

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
    
    // Se il giorno è chiuso, resetta i turni al valore di default
    if (!isOpen) {
      setValue(`operations.openingHours.${day}.shifts`, [
        { from: '12:00', to: '15:00' },
        { from: '19:00', to: '23:00' }
      ]);
    }
  };

  const handleTimeChange = (day: string, shiftIndex: number, field: 'from' | 'to', value: string) => {
    setValue(`operations.openingHours.${day}.shifts.${shiftIndex}.${field}`, value);
  };
  
  const addShift = (day: string) => {
    const currentShifts = watch(`operations.openingHours.${day}.shifts`) || [];
    setValue(`operations.openingHours.${day}.shifts`, [...currentShifts, { from: '00:00', to: '00:00' }]);
  };
  
  const removeShift = (day: string, shiftIndex: number) => {
    const currentShifts = watch(`operations.openingHours.${day}.shifts`) || [];
    if (currentShifts.length <= 1) return; // Mantieni almeno un turno
    
    const newShifts = [...currentShifts];
    newShifts.splice(shiftIndex, 1);
    setValue(`operations.openingHours.${day}.shifts`, newShifts);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dettagli Operativi</h3>
        <p className="text-sm text-gray-500">
          Imposta gli orari di apertura e altre informazioni operative del tuo ristorante.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Orari di Apertura</Label>
          <div className="border rounded-md p-4 space-y-4">
            {daysOfWeek.map((day) => {
              const isOpen = watch(`operations.openingHours.${day.id}.open`);
              const shifts = watch(`operations.openingHours.${day.id}.shifts`) || [];
              
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
                    <div className="pl-7 space-y-3">
                      {shifts.map((shift, shiftIndex) => (
                        <div key={shiftIndex} className="flex items-center gap-2">
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <div>
                              <Label htmlFor={`${day.id}-shift-${shiftIndex}-from`} className="text-xs">Dalle</Label>
                              <Input
                                id={`${day.id}-shift-${shiftIndex}-from`}
                                type="time"
                                value={shift.from}
                                onChange={(e) => handleTimeChange(day.id, shiftIndex, 'from', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${day.id}-shift-${shiftIndex}-to`} className="text-xs">Alle</Label>
                              <Input
                                id={`${day.id}-shift-${shiftIndex}-to`}
                                type="time"
                                value={shift.to}
                                onChange={(e) => handleTimeChange(day.id, shiftIndex, 'to', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          {shifts.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-red-500"
                              onClick={() => removeShift(day.id, shiftIndex)}
                            >
                              <Trash size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 flex items-center"
                        onClick={() => addShift(day.id)}
                      >
                        <Plus size={16} className="mr-1" />
                        Aggiungi fascia oraria
                      </Button>
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
