
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const CompletionStep = () => {
  const { getValues } = useFormContext();
  const formData = getValues();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-3 py-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold">Registrazione completata con successo!</h2>
        <p className="text-gray-600">
          Grazie per aver registrato il tuo ristorante su Gluten Free Eats.
          Il tuo profilo è stato creato e sarà verificato a breve.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-800">Prossimi passaggi</h3>
            <ul className="mt-2 space-y-2 text-blue-700 text-sm">
              <li>✅ Il tuo account è stato creato</li>
              <li>✅ Le informazioni del tuo ristorante sono state salvate</li>
              <li>⏱️ Il nostro team verificherà le informazioni entro 24-48 ore</li>
              <li>🚀 Dopo l'approvazione, il tuo ristorante sarà visibile nell'app</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <p className="text-gray-700 text-center">
          Puoi già accedere alla tua dashboard per completare il tuo profilo
          o aggiungere ulteriori informazioni.
        </p>
        
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/restaurant-dashboard">
              Vai alla Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletionStep;
