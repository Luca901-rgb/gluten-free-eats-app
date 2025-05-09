
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, User, Phone, MapPin, Calendar, Mail, Info } from 'lucide-react';
import Layout from '@/components/Layout';
import { Separator } from '@/components/ui/separator';

interface UserData {
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  gender?: string;
  newsletter?: boolean;
  notificationsEnabled?: boolean;
  certificationType?: string;
  certificationNumber?: string;
}

const UserSettingsPage: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Pre-popola immediatamente i dati dal localStorage
  const [userData, setUserData] = useState<UserData>({
    displayName: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    address: localStorage.getItem('userAddress') || '',
    city: localStorage.getItem('userCity') || '',
    postalCode: localStorage.getItem('userPostalCode') || '',
    province: localStorage.getItem('userProvince') || '',
    birthdate: localStorage.getItem('userBirthdate') || '',
    gender: localStorage.getItem('userGender') || '',
    newsletter: localStorage.getItem('userNewsletter') === 'true' || false,
    notificationsEnabled: localStorage.getItem('userNotifications') === 'true' || true,
    certificationType: localStorage.getItem('userCertificationType') || 'AIC',
    certificationNumber: localStorage.getItem('userCertificationNumber') || '',
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
            address: firestoreData.address || current.address,
            city: firestoreData.city || current.city,
            postalCode: firestoreData.postalCode || current.postalCode,
            province: firestoreData.province || current.province,
            birthdate: firestoreData.birthdate || current.birthdate,
            gender: firestoreData.gender || current.gender,
            newsletter: firestoreData.newsletter !== undefined ? firestoreData.newsletter : current.newsletter,
            notificationsEnabled: firestoreData.notificationsEnabled !== undefined ? firestoreData.notificationsEnabled : current.notificationsEnabled,
            certificationType: firestoreData.certificationType || current.certificationType,
            certificationNumber: firestoreData.certificationNumber || current.certificationNumber,
          }));
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati utente:", err);
        // Continua con i dati del localStorage
      }
    };
    
    loadUserData();
  }, [navigate, userData.displayName, userData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      
      // Aggiorna localStorage per tutti i campi
      localStorage.setItem('userName', userData.displayName);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userPhone', userData.phone || '');
      localStorage.setItem('userAddress', userData.address || '');
      localStorage.setItem('userCity', userData.city || '');
      localStorage.setItem('userPostalCode', userData.postalCode || '');
      localStorage.setItem('userProvince', userData.province || '');
      localStorage.setItem('userBirthdate', userData.birthdate || '');
      localStorage.setItem('userGender', userData.gender || '');
      localStorage.setItem('userNewsletter', String(userData.newsletter || false));
      localStorage.setItem('userNotifications', String(userData.notificationsEnabled || true));
      localStorage.setItem('userCertificationType', userData.certificationType || '');
      localStorage.setItem('userCertificationNumber', userData.certificationNumber || '');
      
      // Se l'utente è autenticato, aggiorna anche Firestore
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          displayName: userData.displayName,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          postalCode: userData.postalCode || '',
          province: userData.province || '',
          birthdate: userData.birthdate || '',
          gender: userData.gender || '',
          newsletter: userData.newsletter || false,
          notificationsEnabled: userData.notificationsEnabled || true,
          certificationType: userData.certificationType || '',
          certificationNumber: userData.certificationNumber || '',
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dati Personali
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nome e Cognome</Label>
              <div className="relative">
                <Input 
                  id="displayName" 
                  name="displayName" 
                  value={userData.displayName} 
                  onChange={handleInputChange}
                  placeholder="Il tuo nome e cognome"
                  className="pl-9"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  name="email" 
                  value={userData.email} 
                  readOnly 
                  disabled 
                  className="bg-gray-50 pl-9"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
              <p className="text-sm text-muted-foreground">L'indirizzo email non può essere modificato</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={userData.phone || ''} 
                    onChange={handleInputChange} 
                    placeholder="Il tuo numero di telefono"
                    className="pl-9"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthdate">Data di nascita</Label>
                <div className="relative">
                  <Input 
                    id="birthdate" 
                    name="birthdate" 
                    type="date"
                    value={userData.birthdate || ''} 
                    onChange={handleInputChange} 
                    className="pl-9"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Indirizzo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Via e numero civico</Label>
              <div className="relative">
                <Input 
                  id="address" 
                  name="address" 
                  value={userData.address || ''} 
                  onChange={handleInputChange} 
                  placeholder="Via Roma 123"
                  className="pl-9"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Città</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={userData.city || ''} 
                  onChange={handleInputChange} 
                  placeholder="Milano"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">CAP</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={userData.postalCode || ''} 
                  onChange={handleInputChange} 
                  placeholder="20100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={userData.province || ''} 
                  onChange={handleInputChange} 
                  placeholder="MI"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Certificazione Celiachia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certificationType">Tipo certificazione</Label>
                <select 
                  id="certificationType"
                  name="certificationType"
                  value={userData.certificationType || ''}
                  onChange={(e) => handleInputChange(e as any)}
                  className="w-full p-2 border rounded"
                >
                  <option value="AIC">AIC</option>
                  <option value="AFC">AFC</option>
                  <option value="Medical">Certificato Medico</option>
                  <option value="Self">Autocertificazione</option>
                  <option value="None">Nessuna</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certificationNumber">Numero certificazione</Label>
                <Input 
                  id="certificationNumber" 
                  name="certificationNumber" 
                  value={userData.certificationNumber || ''} 
                  onChange={handleInputChange} 
                  placeholder="Numero certificazione"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-6" />
        
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
