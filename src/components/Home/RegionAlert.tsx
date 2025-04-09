
import React from 'react';
import { MapPin, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RegionStatusProps {
  regionStatus: {
    checked: boolean;
    inRegion: boolean;
    regionName?: string;
    error?: string;
  };
}

const RegionAlert: React.FC<RegionStatusProps> = ({ regionStatus }) => {
  if (!regionStatus.checked) return null;

  if (regionStatus.error) {
    return (
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <Info className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Posizione non disponibile</AlertTitle>
        <AlertDescription className="text-red-700">
          {regionStatus.error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!regionStatus.inRegion) {
    return (
      <Alert variant="warning" className="bg-amber-50 border-amber-200">
        <MapPin className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Programma Pilota: Area Limitata</AlertTitle>
        <AlertDescription className="text-amber-700">
          Al momento, il nostro servizio è disponibile solo in Campania durante la fase pilota.
          Grazie per la comprensione.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default RegionAlert;
