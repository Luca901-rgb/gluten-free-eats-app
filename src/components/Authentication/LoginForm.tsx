
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Eye, EyeOff, Loader, LogIn } from 'lucide-react';

// Schema di validazione
const formSchema = z.object({
  email: z.string().email({ message: 'Email non valida' }),
  password: z.string().min(1, { message: 'Password richiesta' }),
});

// Tipo interfaccia per le props
interface LoginFormProps {
  userType?: 'customer' | 'restaurant';
}

// Componente del form di login
const LoginForm: React.FC<LoginFormProps> = ({ userType = 'customer' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Inizializzazione del form con react-hook-form e zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Funzione di submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success('Accesso effettuato con successo');
      if (userType === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Errore login:', error);
      let errorMessage = 'Errore durante il login. Riprova.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email o password non validi';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Troppi tentativi falliti. Riprova più tardi.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <Input 
                    placeholder="nome@esempio.com" 
                    type="email" 
                    autoComplete="email" 
                    disabled={isLoading}
                    className="bg-white pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-slate-700">Password</FormLabel>
                <a href="/forgot-password" className="text-sm text-orange-400 hover:underline">
                  Password dimenticata?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <FormControl>
                  <Input 
                    placeholder="••••••" 
                    type={showPassword ? 'text' : 'password'} 
                    autoComplete="current-password" 
                    disabled={isLoading}
                    className="bg-white pl-10" 
                    {...field} 
                  />
                </FormControl>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Accesso in corso...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Accedi
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
