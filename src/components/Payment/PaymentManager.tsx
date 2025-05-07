
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface PaymentManagerProps {
  description: string;
  isGuarantee?: boolean;
  isRestaurantPayment?: boolean;
  isRestaurantRegistration?: boolean;
  onPaymentComplete?: (success: boolean) => void;
}

const PaymentManager: React.FC<PaymentManagerProps> = ({ 
  description,
  isGuarantee = false,
  isRestaurantPayment = false,
  isRestaurantRegistration = false,
  onPaymentComplete
}) => {

  // Auto-complete any action with success
  React.useEffect(() => {
    if (onPaymentComplete) {
      onPaymentComplete(true);
    }
  }, [onPaymentComplete]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          {isGuarantee 
            ? "Garanzia non richiesta" 
            : isRestaurantRegistration 
              ? "Registrazione gratuita"
              : "Servizio gratuito"}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm flex items-start gap-2 bg-blue-50 p-3 rounded-md">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <span className="text-blue-700">
            La registrazione del ristorante è completamente gratuita.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentManager;
