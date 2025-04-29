
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RestaurantCardRegistration from '@/components/Restaurant/RestaurantCardRegistration';
import RestaurantRegistrationPayment from '@/components/Restaurant/RestaurantRegistrationPayment';
import { useNavigate } from 'react-router-dom';
import { Store, CreditCard, Clipboard, Check } from 'lucide-react';

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'payment' | 'information' | 'complete'>('payment');

  const handlePaymentComplete = () => {
    setStep('information');
  };

  const handleInformationComplete = () => {
    setStep('complete');
    setTimeout(() => {
      navigate('/restaurant-dashboard');
    }, 2000);
  };

  return (
    <Layout hideNavigation>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-8">Registrazione Ristorante</h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'payment' || step === 'information' || step === 'complete' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className={`w-16 h-1 ${step === 'information' || step === 'complete' ? 'bg-primary' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'information' || step === 'complete' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                <Store className="w-5 h-5" />
              </div>
              <div className={`w-16 h-1 ${step === 'complete' ? 'bg-primary' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'complete' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                <Clipboard className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2 px-2">
            <span className="text-center w-24">Programma Pilota</span>
            <span className="text-center w-24">Dati Ristorante</span>
            <span className="text-center w-24">Completamento</span>
          </div>
        </div>
        
        {step === 'payment' && (
          <RestaurantRegistrationPayment onComplete={handlePaymentComplete} />
        )}
        
        {step === 'information' && (
          <RestaurantCardRegistration onComplete={handleInformationComplete} />
        )}
        
        {step === 'complete' && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Registrazione Completata!</CardTitle>
              <CardDescription>
                Grazie per aver registrato il tuo ristorante. Stai per essere reindirizzato alla dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-medium">Benvenuto in Gluten Free Eats!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantRegister;
