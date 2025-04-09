
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the booking type
export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  people: number;
  notes: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  bookingCode: string;
  reviewCode?: string;
  hasReview?: boolean;
  restaurantImage?: string;
  customerName: string;
  attendance?: 'confirmed' | 'no-show' | null;
  restaurantReviewCode?: string;
  hasGuarantee?: boolean;
  additionalOptions?: string[];
  isNotificationSeen?: boolean;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  generateReviewCode: (bookingId: string) => string;
  generateRestaurantReviewCode: (bookingId: string) => string;
  getBookingByCode: (bookingCode: string) => Booking | undefined;
  getRestaurantReviewCode: (bookingId: string) => string | undefined;
  getBookingsByRestaurantId: (restaurantId: string) => Booking[];
  markNotificationSeen: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Generate a random code
const generateRandomCode = (length: number = 6, numbersOnly: boolean = false): string => {
  if (numbersOnly) {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  }
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

// Sample initial bookings data
const initialBookings: Booking[] = [
  {
    id: 'b1',
    restaurantId: '1',
    restaurantName: 'La Trattoria Senza Glutine',
    date: '2023-11-25T19:30:00',
    people: 2,
    notes: 'Tavolo vicino alla finestra se possibile',
    status: 'confirmed',
    bookingCode: 'TRA123',
    reviewCode: 'RES456',
    customerName: 'Mario Rossi',
    restaurantImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    attendance: 'confirmed',
    restaurantReviewCode: '1234',
    hasGuarantee: false,
    isNotificationSeen: true,
  },
  {
    id: 'b2',
    restaurantId: '2',
    restaurantName: 'Pizzeria Gluten Free',
    date: '2023-11-28T20:00:00',
    people: 4,
    notes: '',
    status: 'pending',
    bookingCode: 'PZA456',
    customerName: 'Laura Bianchi',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    attendance: null,
    hasGuarantee: false,
    isNotificationSeen: false,
  },
  // ... altri booking di esempio
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addBooking = (booking: Booking) => {
    // Assicuriamoci che ci sia un codice prenotazione
    const newBooking: Booking = {
      ...booking,
      bookingCode: booking.bookingCode || generateRandomCode(6),
      isNotificationSeen: false,
    };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    // Se stiamo confermando la presenza del cliente, generiamo anche il codice recensione 
    // del ristorante se non esiste già
    if (updates.attendance === 'confirmed' && !bookings.find(b => b.id === id)?.restaurantReviewCode) {
      updates.restaurantReviewCode = generateRandomCode(4, true);
    }
    
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
  };

  const markNotificationSeen = (id: string) => {
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, isNotificationSeen: true } : booking
    ));
  };

  const cancelBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const generateReviewCode = (bookingId: string): string => {
    const reviewCode = generateRandomCode(6);
    updateBooking(bookingId, { reviewCode });
    return reviewCode;
  };

  const generateRestaurantReviewCode = (bookingId: string): string => {
    const restaurantReviewCode = generateRandomCode(4, true);
    updateBooking(bookingId, { restaurantReviewCode });
    return restaurantReviewCode;
  };

  const getBookingByCode = (bookingCode: string): Booking | undefined => {
    return bookings.find(booking => booking.bookingCode === bookingCode);
  };
  
  const getRestaurantReviewCode = (bookingId: string): string | undefined => {
    const booking = bookings.find(b => b.id === bookingId);
    return booking?.restaurantReviewCode;
  };
  
  const getBookingsByRestaurantId = (restaurantId: string): Booking[] => {
    return bookings.filter(booking => booking.restaurantId === restaurantId);
  };

  return (
    <BookingContext.Provider 
      value={{ 
        bookings, 
        addBooking, 
        updateBooking, 
        cancelBooking,
        generateReviewCode,
        generateRestaurantReviewCode,
        getBookingByCode,
        getRestaurantReviewCode,
        getBookingsByRestaurantId,
        markNotificationSeen
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}
