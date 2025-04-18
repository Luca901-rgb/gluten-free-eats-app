
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { CreditCard, Calendar, User, Lock, Info } from 'lucide-react';

interface PaymentFormProps {
  onComplete: (success: boolean) => void;
  amount?: number;
  isGuarantee?: boolean;
  isRestaurantPayment?: boolean;
  isRestaurantRegistration?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onComplete, 
  amount = 0, 
  isGuarantee = true,
  isRestaurantPayment = false,
  isRestaurantRegistration = false
}) => {
  // Usiamo dati fittizi per il test
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cardHolder, setCardHolder] = useState('Test User');
  const [cvv, setCvv] = useState('123');
  const [saveCard, setSaveCard] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Funzione per la formattazione, mantenuta per compatibilità
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Funzioni di validazione e gestione eventi, semplificate
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    validateField('cardNumber', formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
    validateField('expiryDate', formattedValue);
  };

  const validateField = (field: string, value: string) => {
    const newErrors = {...errors};
    
    switch(field) {
      case 'cardNumber':
        if (value.replace(/\s/g, '').length < 16) {
          newErrors[field] = 'Numero carta non valido';
        } else {
          delete newErrors[field];
        }
        break;
      case 'expiryDate':
        if (value.length < 5) {
          newErrors[field] = 'Data non valida';
        } else {
          delete newErrors[field];
        }
        break;
      case 'cardHolder':
        if (value.trim().length < 3) {
          newErrors[field] = 'Nome non valido';
        } else {
          delete newErrors[field];
        }
        break;
      case 'cvv':
        if (value.length < 3) {
          newErrors[field] = 'CVV non valido';
        } else {
          delete newErrors[field];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    // Validazione semplificata - sempre valida per il test
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (isGuarantee) {
        toast.success("Carta registrata con successo come garanzia");
      } else if (isRestaurantRegistration) {
        toast.success("Carta registrata con successo per il ristorante");
      } else if (isRestaurantPayment) {
        toast.success("Pagamento del servizio completato con successo");
      } else {
        toast.success("Pagamento effettuato con successo");
      }
      
      onComplete(true);
    }, 500); // Ridotto a 500ms per velocizzare i test
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">
          {isGuarantee 
            ? 'Registra carta come garanzia' 
            : isRestaurantRegistration
              ? 'Registrazione carta del ristorante'
              : isRestaurantPayment 
                ? 'Pagamento servizio di prenotazione' 
                : 'Pagamento servizio'
          }
        </CardTitle>
        <CardDescription>
          {isGuarantee 
            ? 'La carta verrà addebitata solo in caso di no-show non comunicato'
            : isRestaurantRegistration
              ? 'Registra la carta per il ristorante per accettare prenotazioni'
              : isRestaurantPayment
                ? `Pagamento di €${amount.toFixed(2)} per il servizio di prenotazione`
                : `Completa il pagamento di €${amount.toFixed(2)}`
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 mb-4">
            Per la versione demo, i dati della carta sono pre-compilati.<br />
            Clicca su "Conferma" o "Paga" per procedere.
          </p>
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2 text-sm">
            <Info className="text-blue-600 flex-shrink-0" size={16} />
            <div className="text-blue-700">
              {isGuarantee 
                ? 'Modalità demo: Nessuna carta verrà addebitata. Per testare la funzionalità di prenotazione, utilizza il pulsante "Conferma".'
                : isRestaurantRegistration
                  ? 'Modalità demo: Registrazione carta semplificata per test. Nessun dato reale richiesto.'
                  : isRestaurantPayment
                    ? 'Modalità demo: Simulazione di pagamento. Nessun addebito reale.'
                    : 'Modalità demo: Simulazione di pagamento. I dati della carta sono fittizi.'
              }
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading 
              ? 'Elaborazione...' 
              : isGuarantee 
                ? 'Conferma Carta di Garanzia' 
                : isRestaurantRegistration
                  ? 'Registra Carta'
                  : 'Paga Ora'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;
