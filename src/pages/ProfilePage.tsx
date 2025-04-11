
import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Heart, 
  Calendar, 
  FileText,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { auth, db, logoutUser } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
  });

  // Load user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setPersonalInfo(prev => ({
          ...prev,
          email: user.email || '',
          name: user.displayName || ''
        }));
        
        // Try to load additional profile data from Firestore
        try {
          const userProfileDoc = await getDoc(doc(db, "userProfiles", user.uid));
          if (userProfileDoc.exists()) {
            const profileData = userProfileDoc.data();
            setPersonalInfo(prev => ({
              ...prev,
              name: profileData.name || user.displayName || '',
              phone: profileData.phone || '',
              address: profileData.address || '',
              birthDate: profileData.birthDate || '',
            }));
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        // User is not logged in, redirect to login
        navigate('/login');
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logout effettuato con successo');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Errore durante il logout: ${error.message}`);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("Utente non autenticato");
      return;
    }
    
    setIsLoading(true);
    try {
      // Save to Firestore
      await setDoc(doc(db, "userProfiles", userId), {
        name: personalInfo.name,
        phone: personalInfo.phone,
        address: personalInfo.address,
        birthDate: personalInfo.birthDate,
        updatedAt: new Date()
      }, { merge: true });
      
      setIsEditing(false);
      toast.success('Informazioni personali aggiornate con successo');
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(`Errore durante il salvataggio: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // Reset to values from Firebase
    if (userId) {
      try {
        const userProfileDoc = await getDoc(doc(db, "userProfiles", userId));
        if (userProfileDoc.exists()) {
          const profileData = userProfileDoc.data();
          setPersonalInfo(prev => ({
            ...prev,
            name: profileData.name || auth.currentUser?.displayName || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
            birthDate: profileData.birthDate || '',
          }));
        }
      } catch (error) {
        console.error("Error reloading user profile:", error);
      }
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-poppins font-bold text-primary">Il mio profilo</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <div>
                <CardTitle>{personalInfo.name || 'Utente'}</CardTitle>
                <CardDescription>{personalInfo.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Anagrafica - Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Anagrafica</CardTitle>
              <CardDescription>I tuoi dati personali</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                <Edit size={16} className="mr-2" />
                Modifica
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={personalInfo.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      value={personalInfo.email}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data di nascita</Label>
                    <Input 
                      id="birthDate" 
                      name="birthDate"
                      value={personalInfo.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={personalInfo.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.email}</span>
                </div>
                {personalInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.address}</span>
                  </div>
                )}
                {personalInfo.birthDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Nato il: {personalInfo.birthDate}</span>
                  </div>
                )}
                {!personalInfo.phone && !personalInfo.address && !personalInfo.birthDate && (
                  <div className="text-gray-500 italic">
                    Nessuna informazione aggiuntiva disponibile. Clicca su Modifica per aggiungere i tuoi dati.
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-2" />
                Annulla
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save size={16} className="mr-2" />
                {isLoading ? 'Salvataggio...' : 'Salva'}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Tabs defaultValue="bookings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="favorites">Preferiti</TabsTrigger>
            <TabsTrigger value="recipes">Videoricette</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="mt-4 space-y-4 animate-fade-in">
            <div className="bg-secondary/20 rounded-lg p-8 text-center">
              <Calendar size={32} className="mx-auto mb-3 text-primary" />
              <p className="text-gray-700 mb-2">Non hai ancora prenotazioni attive</p>
              <Button variant="outline" onClick={() => navigate('/')}>
                Trova un ristorante
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4 space-y-4 animate-fade-in">
            <div className="bg-secondary/20 rounded-lg p-8 text-center">
              <Heart size={32} className="mx-auto mb-3 text-primary" />
              <p className="text-gray-700 mb-2">Non hai ancora ristoranti preferiti</p>
              <Button variant="outline" onClick={() => navigate('/favorites')}>
                Esplora i preferiti
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recipes" className="mt-4 space-y-4 animate-fade-in">
            <div className="bg-secondary/20 rounded-lg p-8 text-center">
              <FileText size={32} className="mx-auto mb-3 text-primary" />
              <p className="text-gray-700 mb-2">Non hai ancora videoricette salvate</p>
              <Button variant="outline" onClick={() => navigate('/videos')}>
                Esplora videoricette
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
