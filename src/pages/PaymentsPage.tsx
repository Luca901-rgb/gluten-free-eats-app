
import React from 'react';
import Layout from '@/components/Layout';
import PaymentManager from '@/components/Payment/PaymentManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const PaymentsPage = () => {
  // Set hidePayment to true to hide all payment functionality
  const hidePayment = true;
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Sistema di Pagamenti</h1>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="mr-2 h-5 w-5" /> Come funziona il sistema di garanzie e pagamenti
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">Carta di garanzia per i clienti</h3>
                <p className="mt-1">I clienti forniscono i dati della carta come garanzia della prenotazione. La carta verrà addebitata solo in caso di mancata presentazione senza preavviso.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Conferma di presenza</h3>
                <p className="mt-1">Quando il cliente si presenta, il ristorante conferma la presenza tramite l'app e paga una piccola commissione per il servizio di prenotazione.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium">No-show</h3>
                <p className="mt-1">In caso di mancata presentazione, il ristorante può segnalare il no-show e il sistema addebita automaticamente la carta di garanzia del cliente.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-medium">Cancellazioni</h3>
                <p className="mt-1">Le cancellazioni effettuate almeno 2 ore prima della prenotazione non comportano addebiti sulla carta di garanzia del cliente.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="onetime" className="space-y-6">
          <TabsList>
            <TabsTrigger value="onetime">Pagamento Una Tantum</TabsTrigger>
            <TabsTrigger value="subscription">Abbonamenti</TabsTrigger>
          </TabsList>
          
          <TabsContent value="onetime">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pacchetto Base</CardTitle>
                  <CardDescription>Ideale per ristoranti con poche prenotazioni</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={19.99} 
                    description="Pacchetto da 30 prenotazioni senza commissioni aggiuntive"
                    hidePayment={hidePayment}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pacchetto Premium</CardTitle>
                  <CardDescription>Per ristoranti con alto volume di prenotazioni</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={49.99} 
                    description="Pacchetto da 100 prenotazioni con supporto prioritario" 
                    hidePayment={hidePayment}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Abbonamento Base</CardTitle>
                  <CardDescription>Pagamento mensile con prenotazioni illimitate</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={9.99} 
                    description="Abbonamento mensile base con prenotazioni illimitate" 
                    hidePayment={hidePayment}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Abbonamento Premium</CardTitle>
                  <CardDescription>Tutte le funzionalità sbloccate e supporto prioritario</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={29.99} 
                    description="Abbonamento mensile premium con supporto dedicato" 
                    hidePayment={hidePayment}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
