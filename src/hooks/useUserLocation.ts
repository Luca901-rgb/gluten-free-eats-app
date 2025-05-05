
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useUserLocation = () => {
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

  // Check current permission status
  const checkPermissionStatus = async (): Promise<PermissionState> => {
    try {
      // Request permission to check the status
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionState(permissionStatus.state);
      return permissionStatus.state;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      // If we can't check via Permissions API, we'll return 'prompt' as the default
      return 'prompt';
    }
  };

  // Request geolocation permission
  const requestGeolocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await checkPermissionStatus();
      if (permission === 'denied') {
        toast.error('Accesso alla posizione negato. Verifica i permessi nelle impostazioni del dispositivo.');
        return false;
      }

      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          toast.error('Il tuo browser non supporta la geolocalizzazione.');
          resolve(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionState('granted');
            resolve(true);
          },
          (error) => {
            console.error('Errore di geolocalizzazione:', error);
            setPermissionState('denied');
            resolve(false);
          },
          { timeout: 10000, maximumAge: 60000 }
        );
      });
    } catch (error) {
      console.error('Errore nella richiesta permessi di geolocalizzazione:', error);
      return false;
    }
  }, []);

  return {
    permissionState,
    checkPermissionStatus,
    requestGeolocationPermission
  };
};
