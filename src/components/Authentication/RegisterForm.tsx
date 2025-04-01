
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    // Restaurant specific fields
    restaurantName: '',
    address: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Le password non corrispondono");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Accetta i termini e condizioni per continuare");
      return;
    }

    setIsLoading(true);

    try {
      // Simulating registration for demo purposes
      setTimeout(() => {
        toast.success("Registrazione effettuata con successo");
        navigate('/login');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error("Errore durante la registrazione. Riprova più tardi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary font-poppins">Registrati</h1>
        <p className="text-gray-600 mt-2">Crea il tuo account su Gluten Free Eats</p>
      </div>

      <Tabs defaultValue="customer" className="w-full mb-6" onValueChange={(value) => setUserType(value as 'customer' | 'restaurant')}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="customer">Cliente</TabsTrigger>
          <TabsTrigger value="restaurant">Ristoratore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mario Rossi"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
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
              <Label htmlFor="password">Password</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 my-4">
              <Checkbox 
                id="acceptTerms" 
                name="acceptTerms" 
                checked={formData.acceptTerms} 
                onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accetto i termini e le condizioni
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Registrazione in corso...' : 'Registrati come cliente'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="restaurant">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome proprietario</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mario Rossi"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome ristorante</Label>
              <Input
                id="restaurantName"
                name="restaurantName"
                placeholder="Il Ristorante Senza Glutine"
                required
                value={formData.restaurantName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                name="address"
                placeholder="Via Roma 123, Milano"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+39 123 4567890"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ristorante@esempio.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 my-4">
              <Checkbox 
                id="acceptTerms" 
                name="acceptTerms" 
                checked={formData.acceptTerms} 
                onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accetto i termini e le condizioni
              </label>
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Registrazione in corso...' : 'Registrati come ristoratore'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Hai già un account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
