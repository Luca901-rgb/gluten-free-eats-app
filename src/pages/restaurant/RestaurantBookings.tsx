
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useBookings } from '@/context/BookingContext';
import { useNavigate } from 'react-router-dom';
import BookingsByDate from '@/components/Bookings/BookingsByDate';
import NotificationDialog from '@/components/Bookings/NotificationDialog';
import AttendanceDialog from '@/components/Bookings/AttendanceDialog';
import ReviewCodeDialog from '@/components/Bookings/ReviewCodeDialog';
import { checkAttendanceConfirmationNeeded } from '@/components/Bookings/BookingUtils';

const RestaurantBookings = () => {
  const { bookings: allBookings, updateBooking, generateRestaurantReviewCode } = useBookings();
  const navigate = useNavigate();

  const restaurantId = '1';
  const bookings = allBookings.filter(booking => booking.restaurantId === restaurantId);
  
  const [unreadBookings, setUnreadBookings] = useState<string[]>([]);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationBookings, setNotificationBookings] = useState<typeof bookings>([]);

  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [showReviewCodeDialog, setShowReviewCodeDialog] = useState(false);
  const [generatedReviewCode, setGeneratedReviewCode] = useState<string>('');
  
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [attendanceBookings, setAttendanceBookings] = useState<typeof bookings>([]);

  useEffect(() => {
    const pendingBookings = bookings.filter(b => b.status === 'pending' && !unreadBookings.includes(b.id));
    
    if (pendingBookings.length > 0) {
      setUnreadBookings(prev => [...prev, ...pendingBookings.map(b => b.id)]);
      setNotificationBookings(pendingBookings);
      
      if (pendingBookings.length > 0) {
        toast.info(
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <div className="font-semibold">
                {pendingBookings.length} {pendingBookings.length === 1 ? 'nuova prenotazione' : 'nuove prenotazioni'}
              </div>
              <div className="text-sm">Clicca per visualizzare</div>
            </div>
          </div>,
          {
            duration: 5000,
            action: {
              label: "Visualizza",
              onClick: () => setShowNotificationDialog(true)
            }
          }
        );
      }
    }
    
    // Verifica delle prenotazioni che necessitano di conferma presenza
    checkAttendanceConfirmations();
    
    // Imposta un intervallo per controllare periodicamente (ogni minuto)
    const attendanceInterval = setInterval(() => {
      checkAttendanceConfirmations();
    }, 60000);
    
    return () => clearInterval(attendanceInterval);
  }, [bookings]);
  
  // Verifica prenotazioni che necessitano di conferma presenza
  const checkAttendanceConfirmations = () => {
    const needsAttendanceConfirmation = checkAttendanceConfirmationNeeded(bookings);
    
    if (needsAttendanceConfirmation.length > 0) {
      setAttendanceBookings(needsAttendanceConfirmation);
      
      // Mostra notifica per conferma presenza
      toast.info(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <div>
            <div className="font-semibold">
              {needsAttendanceConfirmation.length} {needsAttendanceConfirmation.length === 1 ? 'prenotazione' : 'prenotazioni'} necessitano di conferma presenza
            </div>
            <div className="text-sm">Clicca per confermare</div>
          </div>
        </div>,
        {
          duration: 0, // Non scade
          action: {
            label: "Verifica ora",
            onClick: () => setShowAttendanceDialog(true)
          }
        }
      );
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedReviewCode);
    toast.success('Codice copiato negli appunti');
  };
  
  const redirectToReviews = () => {
    const currentBooking = allBookings.find(b => b.id === currentBookingId);
    if (currentBooking) {
      setShowReviewCodeDialog(false);
      navigate(`/restaurant/${restaurantId}?tab=reviews&bookingCode=${currentBooking.bookingCode}&restaurantCode=${generatedReviewCode}`);
    }
  };

  // Organizza le prenotazioni per data
  const bookingsByDate = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) {
      acc[booking.date] = [];
    }
    acc[booking.date].push(booking);
    return acc;
  }, {} as Record<string, typeof bookings>);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Prenotazioni</h1>
      
      {unreadBookings.length > 0 && (
        <Button 
          onClick={() => setShowNotificationDialog(true)}
          className="mb-6 bg-primary hover:bg-primary/90 flex items-center"
        >
          <Bell className="mr-2 h-4 w-4" />
          {unreadBookings.length} {unreadBookings.length === 1 ? 'nuova prenotazione' : 'nuove prenotazioni'} da confermare
        </Button>
      )}
      
      {attendanceBookings.length > 0 && (
        <Button 
          onClick={() => setShowAttendanceDialog(true)}
          className="mb-6 ml-2 bg-amber-500 hover:bg-amber-600 flex items-center"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          {attendanceBookings.length} {attendanceBookings.length === 1 ? 'prenotazione' : 'prenotazioni'} da verificare
        </Button>
      )}
      
      {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
        <BookingsByDate
          key={date}
          date={date}
          bookings={dateBookings}
          unreadBookings={unreadBookings}
          attendanceBookings={attendanceBookings}
          onConfirmBooking={handleConfirmBooking}
          onCancelBooking={handleCancelBooking}
          onConfirmAttendance={handleConfirmAttendance}
          onNoShow={handleNoShow}
        />
      ))}
      
      {bookings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nessuna prenotazione disponibile</p>
        </div>
      )}
      
      <NotificationDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        bookings={notificationBookings}
        onConfirmBooking={handleConfirmBooking}
      />
      
      <AttendanceDialog
        open={showAttendanceDialog}
        onOpenChange={setShowAttendanceDialog}
        bookings={attendanceBookings}
        onConfirmAttendance={handleConfirmAttendance}
        onNoShow={handleNoShow}
      />
      
      <ReviewCodeDialog
        open={showReviewCodeDialog}
        onOpenChange={setShowReviewCodeDialog}
        reviewCode={generatedReviewCode}
        onCopyCode={handleCopyCode}
        onViewReviews={redirectToReviews}
      />
    </div>
  );
};

export default RestaurantBookings;
