
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/Layout';

interface UserData {
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
}

const UserSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          // Controlla se ci sono dati salvati nel localStorage dalla registrazione
          const storedName = localStorage.getItem('userName');
          const storedEmail = localStorage.getItem('userEmail');
          
          if (storedName && storedEmail) {
            // Usa i dati dal localStorage se non è loggato
            setUserData({
              displayName: storedName,
              email: storedEmail,
              phone: localStorage.getItem('userPhone') || '',
              address: localStorage.getItem('userAddress') || ''
            });
            setLoading(false);
            return;
          }
          
          navigate('/login');
          return;
        }
        
        // Dati di base dell'utente
        let userInfo: UserData = {
          displayName: currentUser.displayName || 
                       localStorage.getItem('userName') || 'Utente',
          email: currentUser.email || 
                 localStorage.getItem('userEmail') || '',
          phone: localStorage.getItem('userPhone') || '',
          address: localStorage.getItem('userAddress') || ''
        };
        
        // Tenta di caricare i dati estesi da Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            userInfo = {
              ...userInfo,
              phone: firestoreData.phone || userInfo.phone || '',
              address: firestoreData.address || userInfo.address || '',
            };
          }
        } catch (err) {
          console.error("Errore nel caricamento dei dati utente:", err);
          // Continua con i dati che abbiamo già
        }
        
        setUserData(userInfo);
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
        toast.error("Errore nel caricamento del profilo");
      } finally {
        setLoading(false);
      }
    };
    
    // Esegui il caricamento dei dati
    loadUserData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (userData) {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      
      if (!userData) {
        toast.error("Impossibile salvare le modifiche");
        return;
      }
      
      // Aggiorna localStorage per utenti non autenticati o come fallback
      localStorage.setItem('userName', userData.displayName);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userPhone', userData.phone || '');
      localStorage.setItem('userAddress', userData.address || '');
      
      // Se l'utente è autenticato, salva anche in Firestore
      if (currentUser) {
        try {
          await updateDoc(doc(db, "users", currentUser.uid), {
            displayName: userData.displayName,
            phone: userData.phone || '',
            address: userData.address || '',
          });
        } catch (err) {
          console.error("Errore nel salvataggio su Firestore:", err);
          // Continua comunque, abbiamo già salvato in localStorage
        }
      }
      
      toast.success("Informazioni aggiornate con successo");
    } catch (err) {
      console.error("Errore nel salvataggio delle informazioni:", err);
      toast.error("Errore nel salvataggio delle informazioni");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Anagrafica Utente</h1>
        </div>
        
        {loading ? (
          <Card className="mb-6 animate-pulse">
            <CardHeader>
              <div className="h-7 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informazioni personali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome</Label>
                  <Input 
                    id="displayName" 
                    name="displayName" 
                    value={userData?.displayName || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={userData?.email || ''} 
                    readOnly 
                    disabled 
                  />
                  <p className="text-sm text-muted-foreground">L'indirizzo email non può essere modificato</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={userData?.phone || ''} 
                    onChange={handleInputChange} 
                    placeholder="Inserisci il tuo numero di telefono" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={userData?.address || ''} 
                    onChange={handleInputChange} 
                    placeholder="Inserisci il tuo indirizzo" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Button 
              className="w-full" 
              onClick={handleSave} 
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio in corso
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salva modifiche
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default UserSettingsPage;
