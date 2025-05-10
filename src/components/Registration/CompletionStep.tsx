
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface CompletionStepProps {
  restaurantId?: string | null;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ restaurantId }) => {
  const navigate = useNavigate();
  
  const handleGoToDashboard = () => {
    navigate('/restaurant-dashboard');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Registrazione Completata!</h2>
        <p className="text-gray-600 mb-6">
          Il tuo ristorante è stato registrato con successo.
          {restaurantId ? ` ID ristorante: ${restaurantId}` : ''}
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-lg mb-3">Cosa puoi fare adesso:</h3>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mr-2 mt-0.5">1</span>
            <span>Personalizza il profilo del tuo ristorante</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mr-2 mt-0.5">2</span>
            <span>Aggiungi il tuo menù completo con tutte le portate</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mr-2 mt-0.5">3</span>
            <span>Configura gli orari di apertura e disponibilità per prenotazioni</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mr-2 mt-0.5">4</span>
            <span>Crea offerte speciali per attirare nuovi clienti</span>
          </li>
        </ul>
        
        <Button 
          onClick={handleGoToDashboard} 
          className="w-full mt-4"
          size="lg"
        >
          Vai alla Dashboard
        </Button>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        <p>Riceverai un'email di conferma con i dettagli della tua registrazione.</p>
        <p className="mt-1">Hai bisogno di aiuto? Contatta il nostro supporto tecnico.</p>
      </div>
    </div>
  );
};

export default CompletionStep;
