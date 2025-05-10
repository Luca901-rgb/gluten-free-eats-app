
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface RestaurantProfileProps {
  stats: StatItem[];
  isRestaurantOwner: boolean;
}

const RestaurantProfile: React.FC<RestaurantProfileProps> = ({ stats, isRestaurantOwner }) => {
  const { user } = useAuth();

  const handleExportData = () => {
    toast.success("Esportazione dati avviata", {
      description: "Riceverai un'email con i tuoi dati."
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profilo Ristorante</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Informazioni Account</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email || "email@example.com"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tipo account</p>
                  <p className="font-medium">Gestore Ristorante</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Membro dal</p>
                  <p className="font-medium">Maggio 2025</p>
                </div>
              </div>
              
              {isRestaurantOwner && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full" onClick={handleExportData}>
                    Esporta dati account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isRestaurantOwner && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Certificazioni</h3>
                
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-700">AIC Certificato</h4>
                    <p className="text-sm text-green-600">Associazione Italiana Celiachia</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4"></path>
                      <path d="M12 8h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Formazione AFC</h4>
                    <p className="text-sm text-blue-600">Corso Alimentazione Fuori Casa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Statistiche</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      {stat.icon}
                      <span className="text-sm text-gray-500 ml-2">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              {isRestaurantOwner && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full">
                    Vedi rapporto completo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isRestaurantOwner && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Attività Recenti</h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm">Nuova prenotazione per 4 persone.</p>
                      <p className="text-xs text-gray-500">2 ore fa</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm">Nuova recensione a 5 stelle ricevuta.</p>
                      <p className="text-xs text-gray-500">Ieri</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm">Creata nuova offerta speciale.</p>
                      <p className="text-xs text-gray-500">2 giorni fa</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;
