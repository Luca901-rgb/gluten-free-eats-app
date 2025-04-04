
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone, MapPin, Store, CreditCard } from 'lucide-react';
import { registerUser, signInWithGoogle } from '@/lib/firebase';
import PaymentForm from '@/components/Booking/PaymentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [cardRegistered, setCardRegistered] = useState(false);
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

  const handlePaymentComplete = (success: boolean) => {
    setShowPaymentDialog(false);
    if (success) {
      setCardRegistered(true);
      toast.success("Carta di credito registrata con successo");
      
      // Proceed with registration
      completeRegistration();
    } else {
      toast.error("Registrazione carta non riuscita");
    }
  };

  const completeRegistration = async () => {
    try {
      // Registrazione con Firebase
      const user = await registerUser(formData.email, formData.password);
      
      // Salva i dati utente nel localStorage
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userId', user.uid);
      
      if (userType === 'restaurant') {
        localStorage.setItem('restaurantName', formData.restaurantName);
        localStorage.setItem('restaurantAddress', formData.address);
        localStorage.setItem('restaurantPhone', formData.phone);
        localStorage.setItem('hasPaymentMethod', 'true');
        navigate('/restaurant-dashboard');
      } else {
        navigate('/');
      }
      
      toast.success("Registrazione effettuata con successo");
    } catch (error: any) {
      toast.error(`Errore durante la registrazione: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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

    if (userType === 'restaurant') {
      // Per i ristoranti, richiedi la carta di credito prima di completare la registrazione
      setShowPaymentDialog(true);
    } else {
      // Per i clienti, procedi direttamente con la registrazione
      completeRegistration();
    }
  };

  const handleGoogleSignIn = async () => {
    if (!formData.acceptTerms) {
      toast.error("Accetta i termini e condizioni per continuare");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await signInWithGoogle();
      
      // Salva i dati utente nel localStorage
      localStorage.setItem('userType', userType);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userName', user.displayName || '');
      localStorage.setItem('userId', user.uid);
      
      if (userType === 'restaurant') {
        // Per i ristoranti, richiedi la carta di credito prima di completare la registrazione
        setShowPaymentDialog(true);
      } else {
        navigate('/');
      }
      
      toast.success("Registrazione con Google effettuata con successo");
    } catch (error: any) {
      toast.error(`Errore durante la registrazione con Google: ${error.message}`);
      setIsLoading(false);
    }
  };

  const renderCustomerForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            placeholder="Mario Rossi"
            required
            value={formData.name}
            onChange={handleChange}
            className="pl-10"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
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
        <Label htmlFor="password">Password</Label>
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
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
        Registrati con Google
      </Button>
    </form>
  );

  const renderRestaurantForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome proprietario</Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            placeholder="Mario Rossi"
            required
            value={formData.name}
            onChange={handleChange}
            className="pl-10"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="restaurantName">Nome ristorante</Label>
        <div className="relative">
          <Input
            id="restaurantName"
            name="restaurantName"
            placeholder="Il Ristorante Senza Glutine"
            required
            value={formData.restaurantName}
            onChange={handleChange}
            className="pl-10"
          />
          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Indirizzo</Label>
        <div className="relative">
          <Input
            id="address"
            name="address"
            placeholder="Via Roma 123, Milano"
            required
            value={formData.address}
            onChange={handleChange}
            className="pl-10"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefono</Label>
        <div className="relative">
          <Input
            id="phone"
            name="phone"
            placeholder="+39 123 4567890"
            required
            value={formData.phone}
            onChange={handleChange}
            className="pl-10"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ristorante@esempio.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 p-3 rounded border border-amber-200">
        <CreditCard className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium">Pagamento Richiesto</p>
          <p>Per completare la registrazione del ristorante, sarà necessario registrare un metodo di pagamento.</p>
        </div>
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
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90" 
        disabled={isLoading}
      >
        {isLoading ? 'Registrazione in corso...' : cardRegistered ? 'Completa registrazione' : 'Continua alla registrazione carta'}
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
        Registrati con Google
      </Button>
    </form>
  );

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary font-poppins">Registrati</h1>
        <p className="text-gray-600 mt-2">Crea il tuo account su Gluten Free Eats</p>
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
        
        <TabsContent value="customer">
          {renderCustomerForm()}
        </TabsContent>
        
        <TabsContent value="restaurant">
          {renderRestaurantForm()}
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
      
      {/* Payment dialog for restaurant registration */}
      <Dialog open={showPaymentDialog} onOpenChange={(open) => {
        if (!open) {
          setIsLoading(false);
        }
        setShowPaymentDialog(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registra metodo di pagamento</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PaymentForm 
              onComplete={handlePaymentComplete} 
              isGuarantee={false}
              amount={0.99}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterForm;
