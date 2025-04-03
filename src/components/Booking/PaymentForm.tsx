
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
  amount?: number; // Importo da pagare, se presente
  isGuarantee?: boolean; // Se è una garanzia o un pagamento effettivo
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onComplete, 
  amount = 0, 
  isGuarantee = true 
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Funzione per formattare il numero della carta
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

  // Funzione per formattare la data di scadenza
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Gestione input numero carta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    
    // Validazione base
    if (formattedValue.replace(/\s/g, '').length < 16) {
      setErrors({...errors, cardNumber: 'Numero carta non valido'});
    } else {
      const newErrors = {...errors};
      delete newErrors.cardNumber;
      setErrors(newErrors);
    }
  };

  // Gestione input data di scadenza
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
    
    // Validazione base
    if (formattedValue.length < 5) {
      setErrors({...errors, expiryDate: 'Data non valida'});
    } else {
      const newErrors = {...errors};
      delete newErrors.expiryDate;
      setErrors(newErrors);
    }
  };

  // Validazione del form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Numero carta non valido';
    }
    
    if (expiryDate.length < 5) {
      newErrors.expiryDate = 'Data non valida';
    }
    
    if (cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Nome non valido';
    }
    
    if (cvv.length < 3) {
      newErrors.cvv = 'CVV non valido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestione invio form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simuliamo una chiamata API per il pagamento
    setTimeout(() => {
      setIsLoading(false);
      toast.success(isGuarantee 
        ? "Carta registrata con successo come garanzia" 
        : "Pagamento effettuato con successo");
      onComplete(true);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">
          {isGuarantee ? 'Registra carta come garanzia' : 'Pagamento prenotazione'}
        </CardTitle>
        <CardDescription>
          {isGuarantee 
            ? 'La carta verrà addebitata solo in caso di no-show non comunicato'
            : `Completa il pagamento di €${amount.toFixed(2)}`
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Numero Carta</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                className="pl-10"
                aria-invalid={!!errors.cardNumber}
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            </div>
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Data di scadenza</Label>
              <div className="relative">
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  className="pl-10"
                  aria-invalid={!!errors.expiryDate}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, '').substring(0, 3))}
                  maxLength={3}
                  className="pl-10"
                  aria-invalid={!!errors.cvv}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              {errors.cvv && (
                <p className="text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardHolder">Titolare Carta</Label>
            <div className="relative">
              <Input
                id="cardHolder"
                type="text"
                placeholder="Mario Rossi"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="pl-10"
                aria-invalid={!!errors.cardHolder}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            </div>
            {errors.cardHolder && (
              <p className="text-sm text-red-500">{errors.cardHolder}</p>
            )}
          </div>
          
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="saveCard" 
              checked={saveCard} 
              onCheckedChange={(checked) => setSaveCard(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="saveCard" className="text-sm text-gray-600">
                Salva questa carta per prenotazioni future
              </Label>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2 text-sm">
            <Info className="text-blue-600 flex-shrink-0" size={16} />
            <div className="text-blue-700">
              {isGuarantee 
                ? 'La tua carta verrà addebitata di €10 (fino a 9 persone) o €20 (da 10 persone in su) solo in caso di mancata presentazione senza cancellazione.'
                : 'I tuoi dati di pagamento sono protetti con crittografia di livello bancario.'
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
            {isLoading ? 'Elaborazione...' : isGuarantee ? 'Conferma Carta di Garanzia' : 'Paga Ora'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;
