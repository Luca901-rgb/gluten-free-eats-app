
import React from 'react';
import { MapPin, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface RegionStatusProps {
  regionStatus: {
    checked: boolean;
    inRegion: boolean;
    regionName?: string;
    error?: string;
  };
  onRetry?: () => void;
}

const RegionAlert: React.FC<RegionStatusProps> = ({ regionStatus, onRetry }) => {
  if (!regionStatus.checked) return null;

  if (regionStatus.error) {
    return (
      <Alert className="bg-amber-50 border-amber-200 mb-4">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Info</AlertTitle>
        <AlertDescription className="text-amber-700">
          {regionStatus.error}
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            >
              Riprova
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!regionStatus.inRegion) {
    return (
      <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
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
