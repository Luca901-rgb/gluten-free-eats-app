
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, logoutUser } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, LogOut, Settings, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Controlla se l'utente è autenticato
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          // Se non è autenticato, reindirizza al login
          console.log("Utente non autenticato, reindirizzo al login");
          navigate('/login');
          return;
        }
        
        // Crea un oggetto utente minimo usando i dati di auth
        let userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || "Utente",
          photoURL: currentUser.photoURL
        };
        
        // Prova a recuperare altri dati da Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists()) {
            userData = {
              ...userData,
              ...userDoc.data()
            };
          }
        } catch (firestoreError) {
          console.error("Errore nel caricamento dati da Firestore:", firestoreError);
          // Non blocchiamo il flusso, usiamo i dati di base disponibili
        }
        
        setUser(userData);
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
        setError("Si è verificato un errore nel caricamento del profilo");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
    
    // Timeout di sicurezza - se dopo 1 secondo ancora carica, forziamo la fine
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(safetyTimeout);
  }, [navigate]);
  
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
      <Layout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Il mio profilo</h1>
          
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardHeader>
          </Card>
          
          <div className="grid gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
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
                    e.currentTarget.src = '/placeholder.svg';
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
            Anagrafica Utente
          </Button>
          
          <Button 
            variant="outline" 
            className="flex justify-start items-center"
            onClick={() => navigate('/admin-dashboard')}
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
    </Layout>
  );
};

export default ProfilePage;
