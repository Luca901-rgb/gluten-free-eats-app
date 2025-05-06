
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Settings, Shield, LogOut, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '@/lib/firebase';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Disconnessione effettuata con successo");
      navigate('/login');
    } catch (error) {
      toast.error("Errore durante la disconnessione");
    }
  };

  // Determina se nascondere il badge basandosi sui parametri URL
  useEffect(() => {
    console.log("ProfilePage montato, location:", location.pathname);
  }, [location]);
  
  return (
    <Layout>
      <div className="min-h-screen bg-[#bfe5c0] pb-20">
        {/* Header */}
        <div className="bg-green-500 text-white p-4">
          <h1 className="text-xl font-bold flex items-center justify-center">
            <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Logo" className="w-8 h-8 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        
        {/* Profile title */}
        <div className="px-4 pt-4 pb-6">
          <h1 className="text-3xl font-bold text-[#38414a]">Il mio profilo</h1>
        </div>
        
        {/* User info card */}
        <div className="bg-white rounded-lg mx-4 p-6 shadow-sm mb-6">
          <div className="flex items-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Utente</h2>
              <p className="text-gray-600">luca.cammarota@live.it</p>
            </div>
          </div>
        </div>
        
        {/* Menu items */}
        <div className="space-y-4 mx-4">
          <div className="bg-white rounded-lg p-4 flex items-center shadow-sm">
            <Settings className="w-6 h-6 mr-4 text-gray-700" />
            <span className="text-lg">Anagrafica Utente</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 flex items-center shadow-sm">
            <Shield className="w-6 h-6 mr-4 text-gray-700" />
            <span className="text-lg">Area amministratore</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 flex items-center shadow-sm" onClick={() => navigate('/favorites')}>
            <Heart className="w-6 h-6 mr-4 text-gray-700" />
            <span className="text-lg">I miei preferiti</span>
          </div>
        </div>
        
        {/* Logout button */}
        <div className="mx-4 mt-8">
          <Button 
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-6 h-auto text-lg flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Disconnetti
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
