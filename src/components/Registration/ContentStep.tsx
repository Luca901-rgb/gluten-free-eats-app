
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, Upload, Check } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';

const ContentStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload to a server
    // For now, just store the file name
    setValue('content.menuPdfUrl', file.name);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Descrizione e Menù</h3>
        <p className="text-sm text-gray-500">
          Aggiungi una descrizione dettagliata del tuo ristorante e carica il menù.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content.description">Descrizione del ristorante *</Label>
          <Textarea
            id="content.description"
            placeholder="Descrivi il tuo locale, la storia, lo stile di cucina, l'atmosfera..."
            className="min-h-[200px]"
            {...register('content.description', { required: "Campo obbligatorio" })}
          />
          {getNestedError(errors, 'content.description') && (
            <p className="text-sm text-red-500 mt-1">
              {getErrorMessage(getNestedError(errors, 'content.description'))}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Carica menù (PDF)</Label>
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium">{watch('content.menuPdfUrl') || 'Nessun file selezionato'}</p>
                  <p className="text-xs text-gray-500">Formato PDF, max 10MB</p>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".pdf" 
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="mr-2" />
                Carica PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start space-x-3">
          <Check className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="space-y-2">
            <Label htmlFor="content.hasGlutenFreeMenu" className="flex items-center space-x-2">
              <Checkbox
                id="content.hasGlutenFreeMenu"
                checked={watch('content.hasGlutenFreeMenu')}
                onCheckedChange={(checked) => setValue('content.hasGlutenFreeMenu', !!checked)}
              />
              <span>Disponiamo di un menù specifico per celiaci (Senza glutine)</span>
            </Label>
            <p className="text-sm text-green-700">
              Selezionando questa opzione, il tuo ristorante sarà incluso nelle ricerche specifiche per opzioni senza glutine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStep;
