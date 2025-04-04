
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Euro, CreditCard, AlertCircle, Info } from 'lucide-react';
import PaymentForm from '@/components/Booking/PaymentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PaymentManagerProps {
  amount: number;
  description: string;
  isGuarantee?: boolean;
  onPaymentComplete?: (success: boolean) => void;
}

const PaymentManager: React.FC<PaymentManagerProps> = ({ 
  amount, 
  description,
  isGuarantee = false,
  onPaymentComplete 
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = (success: boolean) => {
    setShowPaymentDialog(false);
    setIsPaying(false);
    
    if (success) {
      toast.success(isGuarantee 
        ? "Carta di garanzia registrata con successo" 
        : "Pagamento effettuato con successo");
      if (onPaymentComplete) {
        onPaymentComplete(true);
      }
    } else {
      toast.error(isGuarantee
        ? "Registrazione carta non riuscita"
        : "Il pagamento non è andato a buon fine");
      if (onPaymentComplete) {
        onPaymentComplete(false);
      }
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isGuarantee ? (
              <>
                <CreditCard className="h-5 w-5" />
                Registra carta di garanzia
              </>
            ) : (
              <>
                <Euro className="h-5 w-5" />
                Effettua un pagamento
              </>
            )}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold">€{amount.toFixed(2)}</span>
            <Button 
              onClick={handlePayment} 
              className="flex items-center gap-2"
              disabled={isPaying}
            >
              <CreditCard className="h-4 w-4" />
              {isPaying 
                ? "Elaborazione..." 
                : isGuarantee 
                  ? "Registra carta" 
                  : "Paga ora"}
            </Button>
          </div>
          <div className="mt-4 text-sm flex items-start gap-2 bg-blue-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-blue-700">
              {isGuarantee 
                ? "La carta verrà addebitata solo in caso di no-show non comunicato." 
                : "Il pagamento è sicuro e criptato. Utilizziamo tecnologie all'avanguardia per proteggere i tuoi dati."}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isGuarantee ? "Registrazione carta di garanzia" : "Pagamento"}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <PaymentForm 
              onComplete={handlePaymentComplete} 
              amount={amount}
              isGuarantee={isGuarantee}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentManager;
