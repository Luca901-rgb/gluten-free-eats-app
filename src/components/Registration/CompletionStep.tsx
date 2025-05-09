
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import safeStorage from '@/lib/safeStorage';

const CompletionStep = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Assicuriamoci che l'utente sia identificato come ristoratore
    safeStorage.setItem('isRestaurantOwner', 'true');
    safeStorage.setItem('userType', 'restaurant');
  }, []);

  const handleGoDashboard = () => {
    navigate('/restaurant-dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Registrazione completata con successo!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Grazie per aver registrato il tuo ristorante. Ora puoi accedere
          alla dashboard per gestire il tuo profilo e iniziare ad accettare prenotazioni.
        </p>
      </div>
      
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="font-medium">Prossimi passi:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Completa il tuo profilo con foto e descrizioni</li>
              <li>Carica il menu completo del tuo ristorante</li>
              <li>Configura la disponibilità dei tavoli</li>
              <li>Imposta le offerte speciali per i clienti</li>
            </ul>
            
            <Button 
              onClick={handleGoDashboard} 
              className="w-full mt-4"
            >
              Vai alla Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionStep;
