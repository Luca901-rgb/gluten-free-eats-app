
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, LogIn, User, Store } from 'lucide-react';
import { loginUser, signInWithGoogle } from '@/lib/firebase';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login con Firebase
      const user = await loginUser(formData.email, formData.password);
      
      // Salva i dati utente nel localStorage
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userId', user.uid);
      
      toast.success("Accesso effettuato con successo");
      
      // Reindirizza in base al tipo di utente
      if (userType === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(`Errore durante il login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    toast.loading("Accesso con Google in corso...");
    
    try {
      console.log("Avvio autenticazione Google dal form di login");
      const user = await signInWithGoogle();
      console.log("Autenticazione Google completata:", user);
      
      if (!user || !user.uid) {
        throw new Error("Dati utente non validi o incompleti");
      }
      
      // Salva i dati utente nel localStorage
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.displayName || '');
      localStorage.setItem('userId', user.uid);
      
      // Verifica se l'utente è un utente di sviluppo
      const isDevelopmentUser = user.uid.startsWith('dev-');
      if (isDevelopmentUser) {
        toast.dismiss();
        toast.success("Accesso effettuato in modalità sviluppo (dominio non autorizzato in Firebase)");
      } else {
        toast.dismiss();
        toast.success("Accesso con Google effettuato con successo");
      }
      
      // Reindirizza in base al tipo di utente
      if (userType === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Errore durante l'accesso con Google:", error);
      toast.dismiss();
      toast.error(`Errore durante l'accesso con Google: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary font-poppins">Accedi</h1>
        <p className="text-gray-600 mt-2">Benvenuto su Gluten Free Eats</p>
      </div>

      <Tabs defaultValue="customer" className="w-full mb-6" onValueChange={(value) => setUserType(value as 'customer' | 'restaurant')}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="customer" className="flex items-center justify-center gap-2">
            <User size={16} />
            <span>Cliente</span>
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="flex items-center justify-center gap-2">
            <Store size={16} />
            <span>Ristoratore</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nome@esempio.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-accent hover:underline">
              Password dimenticata?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2" disabled={isLoading}>
          <LogIn size={18} />
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </Button>
        
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-600 text-sm">oppure</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Accedi con Google
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Non hai un account?{' '}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
