
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
  coverImage?: string;
  totalReviews?: number;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: Array<{
    days: string;
    hours: string;
  }>;
  menuUrl?: string;
  capacity?: number;
  services?: string[];
  menuItems?: Array<{
    category: string;
    items: Array<{
      name: string;
      description: string;
      price: number;
      glutenFree: boolean;
      image?: string;
      popular?: boolean;
    }>;
  }>;
  videos?: Array<{
    title: string;
    url: string;
    thumbnail?: string;
    description?: string;
  }>;
  gallery?: {
    environment: Array<{url: string, caption?: string}>;
    dishes: Array<{url: string, caption?: string}>;
  };
}

export interface RegionStatus {
  checked: boolean;
  inRegion: boolean;
  regionName?: string;
  error?: string;
}

// Add booking related types
export interface BookingRequest {
  restaurantId: string;
  date: string;
  time: string;
  people: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  specialRequirements?: string[];
}

export interface BookingResponse {
  id: string;
  bookingCode: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  restaurantReviewCode?: string;
}
