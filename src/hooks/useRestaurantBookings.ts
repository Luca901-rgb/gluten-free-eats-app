
import { useState, useEffect } from 'react';
import { useBookings, Booking } from '@/context/BookingContext';
import { toast } from 'sonner';
import { checkAttendanceConfirmationNeeded } from '@/components/Bookings/BookingUtils';

export const useRestaurantBookings = (restaurantId: string) => {
  const { bookings: allBookings, updateBooking, generateRestaurantReviewCode } = useBookings();
  const bookings = allBookings.filter(booking => booking.restaurantId === restaurantId);
  
  const [unreadBookings, setUnreadBookings] = useState<string[]>([]);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationBookings, setNotificationBookings] = useState<Booking[]>([]);

  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [showReviewCodeDialog, setShowReviewCodeDialog] = useState(false);
  const [generatedReviewCode, setGeneratedReviewCode] = useState<string>('');
  
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [attendanceBookings, setAttendanceBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const pendingBookings = bookings.filter(b => b.status === 'pending' && !unreadBookings.includes(b.id));
    
    if (pendingBookings.length > 0) {
      setUnreadBookings(prev => [...prev, ...pendingBookings.map(b => b.id)]);
      setNotificationBookings(pendingBookings);
      
      if (pendingBookings.length > 0) {
        toast.info(`${pendingBookings.length} ${pendingBookings.length === 1 ? 'nuova prenotazione' : 'nuove prenotazioni'} da confermare`, {
          duration: 5000,
          action: {
            label: "Visualizza",
            onClick: () => setShowNotificationDialog(true)
          },
          description: "Clicca per visualizzare"
        });
      }
    }
    
    // Verifica delle prenotazioni che necessitano di conferma presenza
    checkAttendanceConfirmations();
    
    // Imposta un intervallo per controllare periodicamente (ogni minuto)
    const attendanceInterval = setInterval(() => {
      checkAttendanceConfirmations();
    }, 60000);
    
    return () => clearInterval(attendanceInterval);
  }, [bookings, unreadBookings]);
  
  // Verifica prenotazioni che necessitano di conferma presenza
  const checkAttendanceConfirmations = () => {
    const needsAttendanceConfirmation = checkAttendanceConfirmationNeeded(bookings);
    
    if (needsAttendanceConfirmation.length > 0) {
      setAttendanceBookings(needsAttendanceConfirmation);
      
      // Mostra notifica per conferma presenza
      toast.info(`${needsAttendanceConfirmation.length} ${needsAttendanceConfirmation.length === 1 ? 'prenotazione' : 'prenotazioni'} necessitano di conferma presenza`, {
        duration: 0, // Non scade
        action: {
          label: "Verifica ora",
          onClick: () => setShowAttendanceDialog(true)
        },
        description: "Clicca per confermare"
      });
    }
  };
  
  const handleConfirmBooking = (id: string) => {
    updateBooking(id, { status: 'confirmed' });
    toast.success('Prenotazione confermata con successo');
    setUnreadBookings(prev => prev.filter(bookingId => bookingId !== id));
    setNotificationBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleCancelBooking = (id: string) => {
    updateBooking(id, { status: 'cancelled' });
    toast.error('Prenotazione cancellata');
    setUnreadBookings(prev => prev.filter(bookingId => bookingId !== id));
  };

  const handleConfirmAttendance = (id: string) => {
    const code = generateRestaurantReviewCode(id);
    updateBooking(id, { attendance: 'confirmed' });
    setGeneratedReviewCode(code);
    setCurrentBookingId(id);
    setShowReviewCodeDialog(true);
    
    // Rimuovi dalla lista delle prenotazioni che necessitano di conferma presenza
    setAttendanceBookings(prev => prev.filter(b => b.id !== id));
    
    toast.success('Presenza confermata e codice generato per la recensione');
  };

  const handleNoShow = (id: string) => {
    updateBooking(id, { attendance: 'no-show' });
    
    // Rimuovi dalla lista delle prenotazioni che necessitano di conferma presenza
    setAttendanceBookings(prev => prev.filter(b => b.id !== id));
    
    toast.error('Cliente segnato come no-show');
  };
  
  // Organizza le prenotazioni per data
  const bookingsByDate = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedReviewCode);
    toast.success('Codice copiato negli appunti');
  };

  return {
    bookings,
    bookingsByDate,
    unreadBookings,
    attendanceBookings,
    notificationBookings,
    showNotificationDialog,
    setShowNotificationDialog,
    showAttendanceDialog,
    setShowAttendanceDialog,
    showReviewCodeDialog,
    setShowReviewCodeDialog,
    currentBookingId,
    generatedReviewCode,
    handleConfirmBooking,
    handleCancelBooking,
    handleConfirmAttendance,
    handleNoShow,
    handleCopyCode,
    allBookings
  };
};
