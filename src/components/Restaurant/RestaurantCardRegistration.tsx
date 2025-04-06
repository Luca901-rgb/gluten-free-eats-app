
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface RestaurantCardRegistrationProps {
  onComplete?: (success: boolean) => void;
}

const RestaurantCardRegistration: React.FC<RestaurantCardRegistrationProps> = ({ 
  onComplete 
}) => {
  const handleContinue = () => {
    if (onComplete) {
      onComplete(true);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Programma Pilota
        </CardTitle>
        <CardDescription>
          Stai partecipando al programma pilota gratuito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 mb-4">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">Partecipazione confermata</p>
            <p className="text-sm text-green-600">
              Il tuo ristorante è registrato nel programma pilota gratuito per i prossimi 6 mesi.
              Potrai accettare prenotazioni senza costi durante questo periodo.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleContinue}
          className="w-full"
        >
          Continua
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
