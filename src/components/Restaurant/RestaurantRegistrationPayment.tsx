
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface RestaurantRegistrationPaymentProps {
  onComplete?: (success: boolean) => void;
}

const RestaurantRegistrationPayment: React.FC<RestaurantRegistrationPaymentProps> = ({ onComplete }) => {
  const handleContinue = () => {
    // Simula un successo immediato senza richiedere il pagamento
    if (onComplete) {
      onComplete(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Programma Pilota Attivo</CardTitle>
          <CardDescription>
            Stai partecipando al programma pilota gratuito per i prossimi 6 mesi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Periodo gratuito attivo</p>
              <p className="text-sm text-green-600">
                Durante il periodo pilota, tutte le funzionalità sono disponibili gratuitamente. 
                Al termine del periodo pilota ti contatteremo per presentarti le opzioni disponibili.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleContinue} 
            className="w-full"
          >
            Continua con la registrazione
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantRegistrationPayment;
