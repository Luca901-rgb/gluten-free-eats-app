
// Define the Restaurant interface
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string;
  description?: string;
  address?: string;
  distance?: string;
  hasGlutenFreeOptions?: boolean;
  distanceValue?: number;
  isFavorite?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface RegionStatus {
  checked: boolean;
  inRegion: boolean;
  regionName?: string;
  error?: string;
}
