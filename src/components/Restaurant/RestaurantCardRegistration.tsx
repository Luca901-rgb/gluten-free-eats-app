
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Info, Store, Image, CalendarClock, Menu, Video } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 mb-6">
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
        
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3">Completa la tua pagina ristorante</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Menu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Carica il tuo menu</p>
                <p className="text-sm text-gray-500">Aggiungi i tuoi piatti e specialità</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Image className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Aggiungi foto</p>
                <p className="text-sm text-gray-500">Carica immagini del locale e dei piatti</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Videoricette</p>
                <p className="text-sm text-gray-500">Condividi le tue ricette in video</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <CalendarClock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Gestisci prenotazioni</p>
                <p className="text-sm text-gray-500">Imposta disponibilità e conferme</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <Button 
          onClick={handleContinue}
          className="w-full"
        >
          Continua alla dashboard
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
