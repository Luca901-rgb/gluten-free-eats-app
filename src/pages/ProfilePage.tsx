import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, logoutUser } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, LogOut, Settings, User, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prima controlla localStorage per supporto offline
        const cachedUser = localStorage.getItem('user');
        
        // Controlla se l'utente è autenticato
        const currentUser = auth.currentUser;
        
        if (!currentUser && !cachedUser) {
          // Non è autenticato e non ci sono dati in cache
          navigate('/login');
          return;
        }
        
        let userData: any = null;
        
        if (cachedUser) {
          // Usa i dati dalla cache
          try {
            userData = JSON.parse(cachedUser);
            console.log("Caricati dati utente dalla cache:", userData);
          } catch (e) {
            console.error("Errore nel parsing dei dati dalla cache:", e);
          }
        }
        
        if (currentUser) {
          // Se l'utente è autenticato, ottieni dati aggiornati
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            
            if (userDoc.exists()) {
              userData = {
                ...userData,
                ...userDoc.data(),
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || userData?.displayName || "Utente",
                photoURL: currentUser.photoURL || userData?.photoURL
              };
              
              // Aggiorna la cache
              localStorage.setItem('user', JSON.stringify(userData));
            } else if (!userData) {
              // Se non ci sono dati in Firestore e nemmeno in cache
              userData = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || "Utente",
                photoURL: currentUser.photoURL
              };
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (firestoreError) {
            console.error("Errore nel caricamento dati da Firestore:", firestoreError);
            // Continuiamo con i dati in cache se disponibili
            if (!userData) {
              userData = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || "Utente",
                photoURL: currentUser.photoURL
              };
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        }
        
        if (userData) {
          setUser(userData);
        } else {
          setError("Impossibile caricare i dati del profilo");
          
          // Se ci sono stati troppi tentativi falliti, reindirizza al login
          if (loadAttempts >= 2) {
            toast.error("Sessione scaduta, effettua nuovamente l'accesso");
            navigate('/login');
          } else {
            setLoadAttempts(prev => prev + 1);
          }
        }
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
        setError("Si è verificato un errore nel caricamento del profilo");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [navigate, loadAttempts]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout effettuato con successo");
      navigate('/login');
    } catch (error) {
      console.error("Errore durante il logout:", error);
      toast.error("Errore durante il logout");
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Caricamento profilo...</p>
      </div>
    );
  }
  
  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Info className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Errore</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => navigate('/login')}>Vai al login</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Il mio profilo</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "Utente"} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-user.jpg';
                }}
              />
            ) : (
              <User className="h-10 w-10" />
            )}
          </Avatar>
          <div>
            <CardTitle>{user?.displayName || "Utente"}</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid gap-4">
        <Button 
          variant="outline" 
          className="flex justify-start items-center"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5 mr-2" />
          Impostazioni
        </Button>
        
        <Button 
          variant="outline" 
          className="flex justify-start items-center"
          onClick={() => navigate('/admin')}
        >
          <Shield className="h-5 w-5 mr-2" />
          Area amministratore
        </Button>
        
        <Button 
          variant="destructive" 
          className="mt-6 flex justify-center items-center"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Disconnetti
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;