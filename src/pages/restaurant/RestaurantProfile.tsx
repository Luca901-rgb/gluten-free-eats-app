
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, MapPin, Phone, Mail, Globe, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface RestaurantProfileProps {
  stats: StatItem[];
  isRestaurantOwner: boolean;
}

const RestaurantProfile = ({ stats, isRestaurantOwner }: RestaurantProfileProps) => {
  const navigate = useNavigate();
  
  // Dati di esempio per il ristorante
  const restaurantData = {
    name: "La Trattoria Senza Glutine",
    address: "Via Roma 123, Milano",
    phone: "+39 02 1234567",
    email: "info@trattoriasenzaglutine.it",
    website: "www.trattoriasenzaglutine.it",
    isAicCertified: true,
    openingHours: {
      monday: "12:00-15:00, 19:00-23:00",
      tuesday: "12:00-15:00, 19:00-23:00",
      wednesday: "12:00-15:00, 19:00-23:00",
      thursday: "12:00-15:00, 19:00-23:00",
      friday: "12:00-15:00, 19:00-23:00",
      saturday: "12:00-15:00, 19:00-23:30",
      sunday: "Solo cena: 19:00-23:00"
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Profilo Ristorante</h2>
      
      {/* Sezione statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="p-2 rounded-full bg-gray-100 mb-2">
                {stat.icon}
              </div>
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Informazioni ristorante */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Informazioni ristorante</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">{restaurantData.name}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span>{restaurantData.address}</span>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-500 mr-2" />
              <span>{restaurantData.phone}</span>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-2" />
              <span>{restaurantData.email}</span>
            </div>
            
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 mr-2" />
              <span>{restaurantData.website}</span>
            </div>
            
            {restaurantData.isAicCertified && (
              <div className="flex items-center text-green-600">
                <ShieldCheck className="h-5 w-5 mr-2" />
                <span>Certificazione AIC</span>
              </div>
            )}
          </div>
          
          {isRestaurantOwner && (
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => navigate('/restaurant-settings')}
            >
              Modifica informazioni
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Orari di apertura */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            Orari di apertura
          </h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giorno</TableHead>
                <TableHead>Orario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Lunedì</TableCell>
                <TableCell>{restaurantData.openingHours.monday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Martedì</TableCell>
                <TableCell>{restaurantData.openingHours.tuesday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mercoledì</TableCell>
                <TableCell>{restaurantData.openingHours.wednesday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Giovedì</TableCell>
                <TableCell>{restaurantData.openingHours.thursday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Venerdì</TableCell>
                <TableCell>{restaurantData.openingHours.friday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sabato</TableCell>
                <TableCell>{restaurantData.openingHours.saturday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Domenica</TableCell>
                <TableCell>{restaurantData.openingHours.sunday}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          {isRestaurantOwner && (
            <Button variant="outline" className="mt-4">
              Modifica orari
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantProfile;
