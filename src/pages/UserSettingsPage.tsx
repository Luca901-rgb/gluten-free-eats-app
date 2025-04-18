
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
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Pre-popola immediatamente i dati dal localStorage
  const [userData, setUserData] = useState<UserData>({
    displayName: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    address: localStorage.getItem('userAddress') || ''
  });

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        if (!userData.displayName || !userData.email) {
          navigate('/login');
        }
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          setUserData(current => ({
            ...current,
            displayName: firestoreData.displayName || current.displayName,
            phone: firestoreData.phone || current.phone,
            address: firestoreData.address || current.address
          }));
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati utente:", err);
        // Continua con i dati del localStorage
      }
    };
    
    loadUserData();
  }, [navigate, userData.displayName, userData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      
      // Aggiorna localStorage
      localStorage.setItem('userName', userData.displayName);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userPhone', userData.phone || '');
      localStorage.setItem('userAddress', userData.address || '');
      
      // Se l'utente è autenticato, aggiorna anche Firestore
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          displayName: userData.displayName,
          phone: userData.phone || '',
          address: userData.address || '',
        });
      }
      
      toast.success("Informazioni aggiornate con successo");
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
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
                value={userData.displayName} 
                onChange={handleInputChange}
                placeholder="Il tuo nome"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                value={userData.email} 
                readOnly 
                disabled 
                className="bg-gray-50"
              />
              <p className="text-sm text-muted-foreground">L'indirizzo email non può essere modificato</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={userData.phone || ''} 
                onChange={handleInputChange} 
                placeholder="Il tuo numero di telefono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo</Label>
              <Input 
                id="address" 
                name="address" 
                value={userData.address || ''} 
                onChange={handleInputChange} 
                placeholder="Il tuo indirizzo"
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
      </div>
    </Layout>
  );
};

export default UserSettingsPage;
