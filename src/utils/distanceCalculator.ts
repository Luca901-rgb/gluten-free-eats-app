
// Funzione per calcolare la distanza tra due punti geografici (formula dell'emisenoverso)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raggio della Terra in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distanza in km
  return distance;
};

export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  } else {
    return `${distance.toFixed(1)} km`;
  }
};

// Funzione per ordinare i ristoranti per distanza
export const sortRestaurantsByDistance = (restaurants: any[], userLocation: GeolocationCoordinates | null) => {
  if (!userLocation) return restaurants;
  
  return [...restaurants].sort((a, b) => {
    if (!a.distanceValue && !b.distanceValue) return 0;
    if (!a.distanceValue) return 1;
    if (!b.distanceValue) return -1;
    return a.distanceValue - b.distanceValue;
  });
};
