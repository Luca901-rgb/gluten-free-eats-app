
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import safeStorage from '@/lib/safeStorage';

const RestaurantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!email || !password) {
      toast.error('Inserisci email e password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verifica che l'utente sia un ristoratore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().type === 'restaurant') {
        // Utilizziamo safeStorage invece di localStorage per maggiore sicurezza
        safeStorage.setItem('isAuthenticated', 'true');
        safeStorage.setItem('userType', 'restaurant');
        safeStorage.setItem('userEmail', email);
        safeStorage.setItem('userId', user.uid);
        
        // Salviamo specificamente il flag che identifica l'utente come ristoratore
        safeStorage.setItem('isRestaurantOwner', 'true');
        
        toast.success('Login effettuato con successo!');
        
        // Controlla se il ristorante è stato completamente registrato
        const restaurantDoc = await getDoc(doc(db, "restaurants", user.uid));
        
        if (restaurantDoc.exists() && restaurantDoc.data().registrationComplete) {
          // Se la registrazione è completa, vai alla dashboard
          navigate('/restaurant-dashboard?tab=home');
        } else {
          // Altrimenti, vai alla pagina di registrazione
          navigate('/restaurant-registration');
        }
      } else {
        // Se l'utente non è un ristoratore, logout e mostra errore
        await auth.signOut();
        toast.error('Questo account non è registrato come ristorante');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Errore di login. Verifica email e password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNavigation>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <Store className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Accesso Ristoratore</CardTitle>
            <CardDescription>
              Accedi per gestire il tuo ristorante, le prenotazioni e il menu
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="ristorante@esempio.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="#" 
                    className="text-xs text-green-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/forgot-password');
                    }}
                  >
                    Dimenticata?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso in corso...
                  </>
                ) : "Accedi"}
              </Button>
              <p className="text-center text-sm">
                Non hai ancora un ristorante?{' '}
                <a 
                  href="#" 
                  className="text-green-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/restaurant-register');
                  }}
                >
                  Registrati
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RestaurantLogin;
