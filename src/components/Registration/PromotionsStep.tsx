
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Bell, BellOff, Info } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const PromotionsStep = () => {
  const { setValue, watch } = useFormContext();
  
  const enableNotifications = watch('promotions.enableNotifications');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sistema Offerte</h3>
        <p className="text-sm text-gray-500">
          Configura le impostazioni per la promozione di offerte speciali.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Sistema di Offerte</h4>
            <p className="text-sm text-blue-700 mt-1">
              Dopo la registrazione, potrai creare offerte speciali dalla dashboard del tuo ristorante.
              Le offerte verranno mostrate ai clienti che cercano ristoranti nella tua zona.
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableNotifications" className="text-base">Notifiche push per offerte</Label>
              <p className="text-sm text-gray-500">
                Invia notifiche push agli utenti nelle vicinanze quando pubblichi un'offerta
              </p>
            </div>
            <Switch
              id="enableNotifications"
              checked={enableNotifications}
              onCheckedChange={(checked) => setValue('promotions.enableNotifications', checked)}
            />
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center">
              {enableNotifications ? (
                <>
                  <Bell className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-green-700">Notifiche abilitate</span>
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-gray-700">Notifiche disabilitate</span>
                </>
              )}
            </h4>
            <p className="text-sm text-gray-600">
              {enableNotifications
                ? "Gli utenti dell'app riceveranno notifiche quando crei nuove offerte o promozioni. Questo può aumentare la visibilità del tuo ristorante."
                : "Gli utenti non riceveranno notifiche delle tue offerte. Potrai cambiare questa impostazione in qualsiasi momento dalla dashboard."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsStep;
