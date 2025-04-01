
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
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  generateReviewCode: (bookingId: string) => string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

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
  },
  // ... altri booking di esempio
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
  };

  const cancelBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const generateReviewCode = (bookingId: string): string => {
    const reviewCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    updateBooking(bookingId, { reviewCode });
    return reviewCode;
  };

  return (
    <BookingContext.Provider 
      value={{ 
        bookings, 
        addBooking, 
        updateBooking, 
        cancelBooking,
        generateReviewCode
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
