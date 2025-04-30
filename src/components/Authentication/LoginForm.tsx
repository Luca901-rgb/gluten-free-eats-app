
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, LogIn, User, Store, WifiOff } from 'lucide-react';
import { loginUser, signInWithGoogle } from '@/lib/firebase';

interface LoginFormProps {
  initialUserType?: 'customer' | 'restaurant';
}

const LoginForm: React.FC<LoginFormProps> = ({ initialUserType = 'customer' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant'>(initialUserType);
  const [showPassword, setShowPassword] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Check if localStorage is available
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);
  
  useEffect(() => {
    // Test localStorage availability
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setIsStorageAvailable(true);
    } catch (e) {
      setIsStorageAvailable(false);
      console.warn('localStorage non disponibile:', e);
    }
  }, []);
  
  // Monitora lo stato della connessione
  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Imposta lo stato iniziale
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Safe storage function
  const safeStorage = {
    setItem: (key: string, value: string) => {
      if (isStorageAvailable) {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.warn(`Errore nel salvare ${key} in localStorage:`, e);
        }
      } else {
        // Fallback to memory storage when localStorage is not available
        console.log(`localStorage non disponibile, dato non salvato: ${key}`);
      }
    },
    getItem: (key: string) => {
      if (isStorageAvailable) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.warn(`Errore nel recuperare ${key} da localStorage:`, e);
          return null;
        }
      }
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Controlla se l'app è offline
    if (isOffline) {
      toast.error("Non sei connesso a internet. Verifica la tua connessione e riprova.");
      return;
    }
    
    setIsLoading(true);

    try {
      // Login con Firebase
      const user = await loginUser(formData.email, formData.password);
      
      // Usa safeStorage per salvare i dati in modo sicuro
      safeStorage.setItem('userType', userType);
      safeStorage.setItem('isAuthenticated', 'true');
      safeStorage.setItem('userEmail', formData.email);
      safeStorage.setItem('userId', user.uid);
      
      toast.success("Accesso effettuato con successo");
      
      // Reindirizza in base al tipo di utente
      if (userType === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      // Gestione specifica per errori di connessione
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        toast.error("Impossibile connettersi al server. Verifica la tua connessione e riprova.");
      } else {
        toast.error(`Errore durante il login: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Controlla se l'app è offline
    if (isOffline) {
      toast.error("Non sei connesso a internet. Verifica la tua connessione e riprova.");
      return;
    }
    
    setIsLoading(true);
    toast.loading("Accesso con Google in corso...");
    
    try {
      const user = await signInWithGoogle();
      
      // Verifica che l'utente sia valido
      if (!user || !user.uid) {
        throw new Error("Dati utente non validi o incompleti");
      }
      
      // Usa safeStorage per salvare i dati in modo sicuro
      safeStorage.setItem('userType', userType);
      safeStorage.setItem('isAuthenticated', 'true');
      safeStorage.setItem('userEmail', user.email || '');
      safeStorage.setItem('userName', user.displayName || '');
      safeStorage.setItem('userId', user.uid);
      
      toast.dismiss();
      toast.success("Accesso con Google effettuato con successo");
      
      // Reindirizza in base al tipo di utente
      if (userType === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      console.error("Errore durante l'accesso con Google:", error);
      toast.dismiss();
      
      // Gestione specifica per errori di connessione
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        toast.error("Impossibile connettersi a Google. Verifica la tua connessione e riprova.");
      } else {
        toast.error(`Errore: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Definisco la funzione renderLoginForm qui prima di usarla
  const renderLoginForm = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary font-poppins">Accedi</h1>
        <p className="text-gray-600 mt-2">Benvenuto su Gluten Free Eats</p>
      </div>

      <Tabs defaultValue={userType} className="w-full mb-6" onValueChange={(value) => setUserType(value as 'customer' | 'restaurant')}>
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
    </>
  );
  
  // Mostra avviso se localStorage non è disponibile
  if (!isStorageAvailable) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Attenzione: Impossibile salvare dati sul dispositivo. Alcune funzionalità potrebbero non funzionare correttamente.
              </p>
            </div>
          </div>
        </div>
        {renderLoginForm()}
      </div>
    );
  }
  
  // Mostra avviso se offline
  if (isOffline) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <WifiOff size={48} className="mx-auto mb-4 text-red-500" />
        <h2 className="text-2xl font-bold mb-2">Connessione non disponibile</h2>
        <p className="text-gray-600 mb-6">Impossibile connettersi al server. Verifica la tua connessione internet e riprova.</p>
        <Button 
          onClick={() => window.location.reload()}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Riprova
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {renderLoginForm()}
    </div>
  );
};

export default LoginForm;
