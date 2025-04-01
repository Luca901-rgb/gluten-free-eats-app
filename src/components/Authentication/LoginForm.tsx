
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');
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
      // Simulating login for demo purposes
      setTimeout(() => {
        toast.success("Accesso effettuato con successo");
        navigate('/');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error("Errore durante il login. Riprova più tardi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary font-poppins">Accedi</h1>
        <p className="text-gray-600 mt-2">Benvenuto su Gluten Free Eats</p>
      </div>

      <Tabs defaultValue="customer" className="w-full mb-6" onValueChange={(value) => setUserType(value as 'customer' | 'restaurant')}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="customer">Cliente</TabsTrigger>
          <TabsTrigger value="restaurant">Ristoratore</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nome@esempio.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-accent hover:underline">
              Password dimenticata?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
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
