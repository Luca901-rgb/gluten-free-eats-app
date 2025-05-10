
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { getCurrentUserRestaurantId, getRestaurant } from '@/services/restaurantService';
import { RestaurantRegistrationForm } from '@/types/restaurantRegistration';
import safeStorage from '@/lib/safeStorage';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    // Verifica se l'utente è autenticato e di tipo ristorante
    if (!isAuthenticated) {
      toast.error('Accesso negato. Effettua il login.');
      navigate('/login');
      return;
    }

    if (userType !== 'restaurant') {
      toast.error('Non hai i permessi per accedere a questa pagina');
      navigate('/user-redirect');
      return;
    }

    // Carica i dati del ristorante
    const loadRestaurantData = async () => {
      try {
        // Ottieni l'ID del ristorante
        const id = await getCurrentUserRestaurantId();
        
        if (!id) {
          // Se non c'è un ID, controlla se ci sono dati di registrazione in localStorage
          const storedData = safeStorage.getItem('restaurantRegistrationData');
          
          if (storedData) {
            // Usa i dati in localStorage
            setRestaurantData(JSON.parse(storedData));
          } else {
            toast.error('Nessun ristorante trovato. Per favore completa la registrazione.');
            navigate('/restaurant-registration');
          }
        } else {
          setRestaurantId(id);
          
          // Ottieni i dati del ristorante
          const data = await getRestaurant(id);
          
          if (data) {
            setRestaurantData(data);
          } else {
            toast.error('Impossibile caricare i dati del ristorante');
          }
        }
      } catch (error) {
        console.error('Errore durante il caricamento dei dati del ristorante:', error);
        toast.error('Errore durante il caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantData();
  }, [isAuthenticated, navigate, userType]);

  // Se ancora in caricamento, mostra un loader
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Caricamento dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Dashboard principale dopo il caricamento
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Ristorante</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/restaurant-settings')}>
              Impostazioni
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prenotazioni</CardTitle>
              <CardDescription>Totali</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Valutazione</CardTitle>
              <CardDescription>Media</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">N/D</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recensioni</CardTitle>
              <CardDescription>Totali</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Offerte</CardTitle>
              <CardDescription>Attive</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Prenotazioni Recenti</CardTitle>
              <CardDescription>Le tue prenotazioni più recenti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-gray-500">Nessuna prenotazione recente</p>
                <Button variant="link" className="mt-2">
                  Imposta disponibilità
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Ristorante</CardTitle>
              <CardDescription>Dettagli del tuo ristorante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nome</h4>
                  <p>{restaurantData?.restaurant?.name || 'Non specificato'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Indirizzo</h4>
                  <p>{restaurantData?.restaurant?.address || 'Non specificato'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Telefono</h4>
                  <p>{restaurantData?.restaurant?.phone || 'Non specificato'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{restaurantData?.restaurant?.email || 'Non specificato'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                  <p>{restaurantData?.features?.type || 'Non specificato'}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/restaurant-settings')}>
                Modifica informazioni
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recensioni Recenti</CardTitle>
              <CardDescription>Le recensioni più recenti del tuo ristorante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-gray-500">Nessuna recensione</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Offerte Speciali</CardTitle>
              <CardDescription>Le tue offerte attive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-gray-500">Nessuna offerta attiva</p>
                <Button variant="link" className="mt-2">
                  Crea nuova offerta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
