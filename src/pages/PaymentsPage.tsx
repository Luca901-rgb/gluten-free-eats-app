
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const PaymentsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Sistema di Prenotazioni</h1>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="mr-2 h-5 w-5" /> Come funziona il sistema di prenotazioni
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Info className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">Prenotazioni semplici</h3>
                <p className="mt-1">I clienti possono prenotare facilmente un tavolo selezionando data, ora e numero di persone. Non è richiesta alcuna carta di credito.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Conferma di presenza</h3>
                <p className="mt-1">Quando il cliente si presenta, il ristorante conferma la presenza tramite l'app e può generare un codice per la recensione.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium">No-show</h3>
                <p className="mt-1">In caso di mancata presentazione, il ristorante può segnalare il no-show per tenere traccia delle statistiche.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-medium">Cancellazioni</h3>
                <p className="mt-1">Le cancellazioni possono essere effettuate fino a 2 ore prima della prenotazione senza alcuna penalità.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Servizio Base</CardTitle>
              <CardDescription>Per tutti i ristoranti</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm flex items-start gap-2 bg-blue-50 p-3 rounded-md">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-blue-700">
                  Il servizio di prenotazione è completamente gratuito per tutti i ristoranti.
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Funzionalità Premium</CardTitle>
              <CardDescription>Per ristoranti selezionati</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm flex items-start gap-2 bg-blue-50 p-3 rounded-md">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-blue-700">
                  Le funzionalità premium sono attualmente disponibili gratuitamente per tutti i ristoranti.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
