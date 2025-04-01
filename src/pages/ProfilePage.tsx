
import React from 'react';
import { User, LogOut, Heart, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ProfileTypeSwitch from '@/components/ProfileTypeSwitch';

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logout effettuato con successo');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

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

        <ProfileTypeSwitch />
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <div>
                <CardTitle>{localStorage.getItem('userName') || 'Mario Rossi'}</CardTitle>
                <CardDescription>{localStorage.getItem('userEmail') || 'mario.rossi@example.com'}</CardDescription>
              </div>
            </div>
          </CardHeader>
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
              <Button variant="outline" onClick={() => navigate('/')}>
                Esplora ristoranti
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recipes" className="mt-4 space-y-4 animate-fade-in">
            <div className="bg-secondary/20 rounded-lg p-8 text-center">
              <FileText size={32} className="mx-auto mb-3 text-primary" />
              <p className="text-gray-700 mb-2">Non hai ancora videoricette salvate</p>
              <Button variant="outline" onClick={() => navigate('/')}>
                Esplora ristoranti
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
