export interface RestaurantRegistrationForm {
  // Step 1: Manager Information
  manager: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  };
  
  // Step 2: Restaurant Main Data
  restaurant: {
    name: string;
    address: string;
    zipCode: string;
    city: string;
    province: string;
    location?: {
      lat: number;
      lng: number;
    };
    email: string;
    phone: string;
    website?: string;
    taxId: string;
  };
  
  // Step 3: Operational Details
  operations: {
    openingHours: {
      [key: string]: {
        open: boolean;
        shifts: Array<{
          from: string;
          to: string;
        }>;
      };
    };
    priceRange: string;
    capacity: number;
  };
  
  // Step 4: Features and Services
  features: {
    type: string;
    otherType?: string;
    services: string[];
    hasGlutenFreeOptions: boolean;
  };
  
  // Step 5: Multimedia Content
  media: {
    coverImage?: string;
    gallery: {
      environment: Array<{url: string, caption?: string}>;
      dishes: Array<{url: string, caption?: string}>;
    };
    videos: Array<{
      title: string;
      url: string;
      thumbnail?: string;
      description?: string;
    }>;
  };
  
  // Step 6: Description and Menu
  content: {
    description: string;
    menuPdfUrl?: string;
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
    hasGlutenFreeMenu: boolean;
  };
  
  // Step 7: Booking Management
  bookings: {
    tables: {
      lunch: number;
      dinner: number;
    };
    cancellationPolicy: string;
    requiresDeposit?: boolean;
  };
  
  // Step 8: Promotions System
  promotions: {
    enableNotifications: boolean;
  };
}

export type RegistrationStep = 
  | 'manager' 
  | 'restaurant' 
  | 'operations' 
  | 'features' 
  | 'media' 
  | 'content' 
  | 'bookings' 
  | 'promotions' 
  | 'complete';
