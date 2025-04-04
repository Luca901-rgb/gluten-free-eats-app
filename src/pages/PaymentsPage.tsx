
import React from 'react';
import Layout from '@/components/Layout';
import PaymentManager from '@/components/Payment/PaymentManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const PaymentsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Sistema di Pagamenti</h1>
        
        <Tabs defaultValue="onetime" className="space-y-6">
          <TabsList>
            <TabsTrigger value="onetime">Pagamento Una Tantum</TabsTrigger>
            <TabsTrigger value="subscription">Abbonamenti</TabsTrigger>
          </TabsList>
          
          <TabsContent value="onetime">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={19.99} 
                    description="Pacchetto base per prenotazioni senza commissioni" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={49.99} 
                    description="Pacchetto premium con supporto prioritario" 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subscription">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={9.99} 
                    description="Abbonamento mensile base (in arrivo)" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <PaymentManager 
                    amount={29.99} 
                    description="Abbonamento mensile premium (in arrivo)" 
                  />
                </CardContent>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Gli abbonamenti sono in fase di implementazione e saranno disponibili a breve.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
