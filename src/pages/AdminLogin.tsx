
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User, LogIn, ShieldCheck, WifiOff } from 'lucide-react';
import { loginUser, setSpecificUserAsAdmin } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAdmin } from '@/context/AdminContext';
import Layout from '@/components/Layout';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const db = getFirestore();

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingAdmin, setIsSettingAdmin] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin } = useAdmin();

  // Verifica se l'admin è già configurato in localStorage
  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (adminEmail) {
      setSetupComplete(true);
    }
  }, []);

  // Redirect se già autenticato come admin
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login con Firebase
      await loginUser(email, password);
      
      // Prima controlla il localStorage (per modalità offline)
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (adminEmail && adminEmail === email) {
        setIsAdmin(true);
        toast.success("Accesso come amministratore effettuato (modalità offline)");
        navigate('/admin-dashboard');
        return;
      }
      
      // Verifica se l'utente è un admin in Firestore
      try {
        const adminRef = doc(db, "admins", email);
        const adminSnap = await getDoc(adminRef);
        
        if (adminSnap.exists()) {
          setIsAdmin(true);
          localStorage.setItem('adminEmail', email); // Salva per accessi offline
          toast.success("Accesso come amministratore effettuato");
          navigate('/admin-dashboard');
        } else {
          toast.error("Non hai i permessi di amministratore");
          setIsAdmin(false);
        }
      } catch (firebaseError: any) {
        console.error("Errore Firebase:", firebaseError);
        toast.error("Errore nella verifica dello stato admin. Controlla la tua connessione.");
      }
    } catch (error: any) {
      toast.error(`Errore durante il login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupAdmin = async () => {
    setIsSettingAdmin(true);
    try {
      const result = await setSpecificUserAsAdmin();
      
      if (result.success) {
        setSetupComplete(true);
        setOfflineMode(result.offline || false);
        
        if (result.offline) {
          toast.warning("Configurazione completata in modalità offline. I dati verranno sincronizzati quando sarai online.");
        } else {
          toast.success("Amministratore impostato con successo: lcammarota24@gmail.com");
        }
      } else {
        toast.error(`Errore nell'impostazione dell'amministratore: ${result.message}`);
      }
    } catch (error: any) {
      toast.error(`Errore: ${error.message}`);
      setOfflineMode(true);
    } finally {
      setIsSettingAdmin(false);
    }
  };

  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-primary">Admin Access</CardTitle>
            <CardDescription>
              Accedi come amministratore per gestire la piattaforma
            </CardDescription>
          </CardHeader>
          
          {offlineMode && (
            <div className="px-6 mb-4">
              <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Modalità offline</AlertTitle>
                <AlertDescription>
                  Sei attualmente in modalità offline. Alcune funzionalità potrebbero essere limitate.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs defaultValue="login" className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="setup">Setup Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@glutenfreeeats.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <LogIn size={18} />
                    {isLoading ? 'Accesso in corso...' : 'Accedi come Admin'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="setup">
              <CardContent className="space-y-4">
                <div className={`rounded-md p-4 ${setupComplete ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'}`}>
                  <h3 className="font-medium mb-2">Configurazione Amministratore</h3>
                  
                  {setupComplete ? (
                    <>
                      <p>✅ Configurazione completata! L'utente <strong>lcammarota24@gmail.com</strong> è stato impostato come amministratore.</p>
                      <p className="mt-2">Ora puoi tornare alla scheda "Accedi" per effettuare il login.</p>
                      {offlineMode && (
                        <p className="mt-2 text-orange-700">⚠️ Configurazione effettuata in modalità offline. I dati verranno sincronizzati quando sarai online.</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p>Questa sezione permette di configurare <strong>lcammarota24@gmail.com</strong> come amministratore nel sistema.</p>
                      <p className="mt-2">Fai clic sul pulsante qui sotto per completare la configurazione.</p>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSetupAdmin}
                  className={`w-full flex items-center gap-2 ${
                    setupComplete 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={isSettingAdmin || (setupComplete && !offlineMode)}
                >
                  <ShieldCheck size={18} />
                  {isSettingAdmin 
                    ? 'Configurazione in corso...' 
                    : setupComplete 
                      ? offlineMode 
                        ? 'Riprova sincronizzazione' 
                        : 'Configurazione completata' 
                      : 'Imposta lcammarota24@gmail.com come Admin'}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>

          <div className="px-6 pb-6 text-center text-sm text-gray-500">
            <p>Solo gli utenti registrati come amministratori possono accedere</p>
            <p className="mt-1">Usa la scheda "Setup Admin" per configurare l'amministratore</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
