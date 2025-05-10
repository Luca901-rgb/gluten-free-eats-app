
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import safeStorage from '@/lib/safeStorage';

const RestaurantLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Inserisci email e password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Imposta il tipo di utente a "restaurant"
      safeStorage.setItem('userType', 'restaurant');
      safeStorage.setItem('isAuthenticated', 'true');
      safeStorage.setItem('isRestaurantOwner', 'true');
      safeStorage.setItem('userId', user.uid);
      safeStorage.setItem('userEmail', formData.email);
      
      setUser(user);
      
      toast.success('Login effettuato con successo');
      navigate('/restaurant-dashboard');
    } catch (error: any) {
      console.error('Errore durante il login:', error);
      
      let errorMessage = 'Si è verificato un errore durante il login';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email o password non corretti';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Formato email non valido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Troppi tentativi di login. Riprova più tardi';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a3e0a8]">
      <div className="w-full max-w-md px-4">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          GlutenFree Eats
        </h1>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Login Ristorante</CardTitle>
            <CardDescription>
              Accedi per gestire il tuo ristorante
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="esempio@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-sm text-right">
                <a href="#" className="text-blue-600 hover:underline">
                  Password dimenticata?
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Caricamento...' : 'Accedi'}
              </Button>
              <div className="text-sm text-center">
                Non hai ancora un ristorante?{" "}
                <Link to="/restaurant-registration" className="text-blue-600 hover:underline">
                  Registrati
                </Link>
              </div>
              <div className="text-sm text-center">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login cliente
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantLogin;
