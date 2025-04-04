
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PaymentManager from '@/components/Payment/PaymentManager';

interface RestaurantCardRegistrationProps {
  onComplete?: (success: boolean) => void;
}

const RestaurantCardRegistration: React.FC<RestaurantCardRegistrationProps> = ({ 
  onComplete 
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  
  const handleRegistrationComplete = (success: boolean) => {
    if (success) {
      setIsRegistered(true);
      if (onComplete) {
        onComplete(true);
      }
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Registrazione carta
        </CardTitle>
        <CardDescription>
          Registra la carta per il tuo ristorante per poter accettare prenotazioni
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistered ? (
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Carta registrata con successo</p>
              <p className="text-sm text-green-600">La tua carta è stata registrata e potrai utilizzarla per i pagamenti del servizio.</p>
            </div>
          </div>
        ) : (
          <PaymentManager 
            amount={0} 
            description="Registra la tua carta per i pagamenti futuri del servizio. Non ti sarà addebitato nulla in questa fase."
            isRestaurantRegistration={true}
            onPaymentComplete={handleRegistrationComplete}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
