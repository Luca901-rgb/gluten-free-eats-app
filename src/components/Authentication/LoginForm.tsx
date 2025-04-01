
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, LogIn, User } from 'lucide-react';

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
      // Qui implementeremmo la logica di autenticazione con Firebase
      // Per ora simuliamo un login di successo
      setTimeout(() => {
        toast.success("Accesso effettuato con successo");
        navigate('/');
        setIsLoading(false);
        
        // Simuliamo il salvataggio dei dati utente nel localStorage
        localStorage.setItem('userType', userType);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
      }, 1500);
    } catch (error) {
      toast.error("Errore durante il login. Riprova più tardi.");
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
            <User size={16} />
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
