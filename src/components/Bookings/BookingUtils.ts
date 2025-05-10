
import { Booking } from '@/context/BookingContext';

/**
 * Controlla quali prenotazioni hanno bisogno di conferma presenza
 * Restituisce un array di prenotazioni che sono per la data di oggi e 
 * che non hanno ancora una conferma di presenza
 */
export const checkAttendanceConfirmationNeeded = (bookings: Booking[]): Booking[] => {
  // Ottieni la data di oggi (senza orario)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Ottieni la data di domani (senza orario)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Filtra le prenotazioni che sono per oggi e che non hanno una conferma di presenza
  return bookings.filter(booking => {
    // Estrai solo la data dalla prenotazione
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    
    // Controlla se la prenotazione è confermata, per oggi e senza conferma di presenza
    return booking.status === 'confirmed' && 
           bookingDate.getTime() === today.getTime() && 
           booking.attendance === null;
  });
};

/**
 * Formatta la data per la visualizzazione
 */
export const formatBookingDate = (date: string | Date): string => {
  const bookingDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return bookingDate.toLocaleDateString('it-IT', options);
};

/**
 * Controlla se una prenotazione è passata (nel passato)
 */
export const isBookingPast = (date: string | Date): boolean => {
  const now = new Date();
  const bookingDate = new Date(date);
  return bookingDate < now;
};

/**
 * Raggruppa le prenotazioni per data
 */
export const groupBookingsByDate = (bookings: Booking[]): Record<string, Booking[]> => {
  const grouped: Record<string, Booking[]> = {};
  
  bookings.forEach(booking => {
    const date = new Date(booking.date);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(booking);
  });
  
  return grouped;
};

/**
 * Ordina le prenotazioni per data
 */
export const sortBookingsByDate = (bookings: Booking[], ascending: boolean = true): Booking[] => {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};
