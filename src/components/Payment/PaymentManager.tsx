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
  isRestaurantPayment?: boolean;
  isRestaurantRegistration?: boolean;
  onPaymentComplete?: (success: boolean) => void;
  hidePayment?: boolean;
}

const PaymentManager: React.FC<PaymentManagerProps> = ({ 
  amount, 
  description,
  isGuarantee = false,
  isRestaurantPayment = false,
  isRestaurantRegistration = false,
  onPaymentComplete,
  hidePayment = false
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
      if (isGuarantee) {
        toast.success("Carta di garanzia registrata con successo");
      } else if (isRestaurantRegistration) {
        toast.success("Carta registrata con successo per il ristorante");
      } else if (isRestaurantPayment) {
        toast.success("Pagamento del servizio completato");
      } else {
        toast.success("Pagamento effettuato con successo");
      }
      
      if (onPaymentComplete) {
        onPaymentComplete(true);
      }
    } else {
      if (isGuarantee) {
        toast.error("Registrazione carta non riuscita");
      } else if (isRestaurantRegistration) {
        toast.error("Registrazione carta del ristorante non riuscita");
      } else if (isRestaurantPayment) {
        toast.error("Pagamento del servizio non riuscito");
      } else {
        toast.error("Il pagamento non è andato a buon fine");
      }
      
      if (onPaymentComplete) {
        onPaymentComplete(false);
      }
    }
  };

  if (hidePayment) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isGuarantee ? (
              <>
                <Info className="h-5 w-5" />
                Garanzia temporaneamente non disponibile
              </>
            ) : isRestaurantRegistration ? (
              <>
                <Info className="h-5 w-5" />
                Registrazione temporaneamente non disponibile
              </>
            ) : (
              <>
                <Info className="h-5 w-5" />
                Pagamenti temporaneamente non disponibili
              </>
            )}
          </CardTitle>
          <CardDescription>
            Questa funzionalità non è attualmente disponibile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm flex items-start gap-2 bg-blue-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-blue-700">
              Stiamo aggiornando il nostro sistema di pagamento. La funzionalità sarà disponibile a breve.
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            ) : isRestaurantRegistration ? (
              <>
                <CreditCard className="h-5 w-5" />
                Registra carta del ristorante
              </>
            ) : isRestaurantPayment ? (
              <>
                <Euro className="h-5 w-5" />
                Paga servizio di prenotazione
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
                  : isRestaurantRegistration
                    ? "Registra carta"
                    : "Paga ora"}
            </Button>
          </div>
          <div className="mt-4 text-sm flex items-start gap-2 bg-blue-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-blue-700">
              {isGuarantee 
                ? "La carta verrà addebitata solo in caso di no-show non comunicato." 
                : isRestaurantRegistration
                  ? "La carta verrà utilizzata per i pagamenti del servizio di prenotazione."
                  : isRestaurantPayment
                    ? "Il pagamento serve a coprire i costi del servizio di prenotazione."
                    : "Il pagamento è sicuro e criptato. Utilizziamo tecnologie all'avanguardia per proteggere i tuoi dati."}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isGuarantee 
                ? "Registrazione carta di garanzia" 
                : isRestaurantRegistration
                  ? "Registrazione carta del ristorante"
                  : isRestaurantPayment 
                    ? "Pagamento servizio" 
                    : "Pagamento"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <PaymentForm 
              onComplete={handlePaymentComplete} 
              amount={amount}
              isGuarantee={isGuarantee}
              isRestaurantRegistration={isRestaurantRegistration}
              isRestaurantPayment={isRestaurantPayment}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentManager;
