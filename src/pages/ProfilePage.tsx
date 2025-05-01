
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, logoutUser } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, LogOut, Settings, User, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import safeStorage from '@/lib/safeStorage';

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
        
        console.log("ProfilePage - Caricamento profilo utente...");
        
        // Usa sia localStorage che auth.currentUser per massima compatibilità
        const currentUser = auth.currentUser;
        const userIdFromStorage = safeStorage.getItem('userId');
        const userEmailFromStorage = safeStorage.getItem('userEmail');
        const userNameFromStorage = safeStorage.getItem('userName');
        const isAuthenticated = safeStorage.getItem('isAuthenticated');
        
        console.log("ProfilePage - currentUser:", currentUser);
        console.log("ProfilePage - userIdFromStorage:", userIdFromStorage);
        console.log("ProfilePage - userEmailFromStorage:", userEmailFromStorage);
        console.log("ProfilePage - isAuthenticated:", isAuthenticated);
        
        // Se non c'è un utente autenticato né in storage, reindirizza al login
        if ((!currentUser && !userIdFromStorage && !userEmailFromStorage) || isAuthenticated !== 'true') {
          console.log("Nessun utente autenticato trovato, reindirizzo al login");
          toast.error("Effettua il login per visualizzare il profilo");
          setTimeout(() => navigate('/login'), 500);
          return;
        }
        
        // Crea un oggetto utente minimo usando i dati disponibili
        let userData = {
          uid: currentUser?.uid || userIdFromStorage || 'guest-user',
          email: currentUser?.email || userEmailFromStorage || 'Utente offline',
          displayName: currentUser?.displayName || userNameFromStorage || "Utente",
          photoURL: currentUser?.photoURL || null
        };
        
        // Se siamo online, prova a recuperare altri dati da Firestore
        if (navigator.onLine) {
          try {
            if (currentUser) {
              const userDoc = await getDoc(doc(db, "users", currentUser.uid));
              
              if (userDoc.exists()) {
                userData = {
                  ...userData,
                  ...userDoc.data()
                };
                
                // Salva dati importanti nel safeStorage per accesso offline
                safeStorage.setItem('userName', userData.displayName);
                safeStorage.setItem('userEmail', userData.email);
                if (userData.photoURL) safeStorage.setItem('userPhotoURL', userData.photoURL);
              }
            } else if (userIdFromStorage) {
              // Prova a caricare dati usando l'ID utente in storage
              try {
                const userDoc = await getDoc(doc(db, "users", userIdFromStorage));
                if (userDoc.exists()) {
                  userData = {
                    ...userData,
                    ...userDoc.data()
                  };
                }
              } catch (e) {
                console.warn("Errore nel caricamento dati utente da Firestore usando ID in storage", e);
              }
            }
          } catch (firestoreError) {
            console.error("Errore nel caricamento dati da Firestore:", firestoreError);
          }
        }
        
        console.log("ProfilePage - userData caricato:", userData);
        setUser(userData);
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
        setError("Si è verificato un errore nel caricamento del profilo");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
    
    // Timeout di sicurezza - se dopo 2 secondi ancora carica, forziamo la fine
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setUser({
          displayName: safeStorage.getItem('userName') || "Utente",
          email: safeStorage.getItem('userEmail') || "utente@esempio.com",
          photoURL: safeStorage.getItem('userPhotoURL') || null
        });
      }
    }, 2000);
    
    return () => clearTimeout(safetyTimeout);
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout effettuato con successo");
      navigate('/login');
    } catch (error) {
      console.error("Errore durante il logout:", error);
      
      // Fallback per logout offline
      safeStorage.removeItem('isAuthenticated');
      safeStorage.removeItem('userType');
      safeStorage.removeItem('userId');
      safeStorage.removeItem('userEmail');
      safeStorage.removeItem('userName');
      
      toast.success("Logout effettuato");
      navigate('/login');
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
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Errore</h1>
          <p className="mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>Riprova</Button>
            <Button variant="outline" onClick={() => navigate('/login')}>Torna al login</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Sessione non valida</h1>
          <p className="mb-6">La tua sessione è scaduta o non sei connesso.</p>
          <Button onClick={() => navigate('/login')}>Accedi</Button>
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
