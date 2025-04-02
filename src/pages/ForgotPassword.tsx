
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { resetPassword } from '@/lib/firebase';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Inserisci la tua email per recuperare la password');
      return;
    }
    
    setIsLoading(true);

    try {
      // Utilizziamo Firebase per inviare l'email di reset
      await resetPassword(email);
      toast.success('Email per il reset della password inviata con successo!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      toast.error(`Errore nell'invio dell'email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary font-poppins">Password dimenticata</h1>
            <p className="text-gray-600 mt-2">Ti invieremo un'email con le istruzioni per reimpostare la tua password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10" 
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Invio in corso...' : 'Invia email di recupero'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Ricordi la tua password?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                Torna al login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
