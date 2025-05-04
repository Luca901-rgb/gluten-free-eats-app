
import { useState, useCallback } from 'react';
import { RegionStatus } from '@/types/restaurant';
import { checkUserRegion } from '@/utils/geolocation';

export const useRegionVerification = () => {
  const [regionStatus, setRegionStatus] = useState<RegionStatus>({
    checked: false,
    inRegion: false
  });

  const verifyRegion = useCallback(async () => {
    try {
      const result = await checkUserRegion();
      setRegionStatus({
        checked: true,
        inRegion: true,
        regionName: result.regionName,
        error: null
      });
      return true;
    } catch (error) {
      console.error("Errore durante la verifica della regione:", error);
      setRegionStatus({
        checked: true,
        inRegion: true,
        error: null
      });
      return true;
    }
  }, []);

  return {
    regionStatus,
    verifyRegion
  };
};
