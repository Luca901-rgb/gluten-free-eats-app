
import { useState, useEffect } from 'react';
import { useBookings, Booking } from '@/context/BookingContext';
import { toast } from 'sonner';
import { checkAttendanceConfirmationNeeded } from '@/components/Bookings/BookingUtils';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export const useRestaurantBookings = (restaurantId: string) => {
  const { bookings: contextBookings, updateBooking, generateRestaurantReviewCode } = useBookings();
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [unreadBookings, setUnreadBookings] = useState<string[]>([]);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationBookings, setNotificationBookings] = useState<Booking[]>([]);

  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [showReviewCodeDialog, setShowReviewCodeDialog] = useState(false);
  const [generatedReviewCode, setGeneratedReviewCode] = useState<string>('');
  
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [attendanceBookings, setAttendanceBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      
      try {
        // First check from context and then try to load from Firestore
        let bookingsFromFirestore: Booking[] = [];
        
        try {
          // We're keeping the context bookings integration for backward compatibility
          const fromContext = contextBookings.filter(booking => booking.restaurantId === restaurantId);
          if (fromContext.length > 0) {
            bookingsFromFirestore = fromContext;
          } else {
            // If not in context, try loading from Firestore
            const bookingsCollection = collection(db, "bookings");
            const q = query(bookingsCollection, where("restaurantId", "==", restaurantId));
            const querySnapshot = await getDocs(q);
            
            bookingsFromFirestore = querySnapshot.docs.map(doc => {
              const data = doc.data();
              // Map Firestore data to Booking type, ensuring all required fields are present
              return {
                id: doc.id,
                restaurantId: data.restaurantId,
                restaurantName: data.restaurantName || 'Ristorante',
                date: data.date,
                time: data.time,
                people: data.people || 1,
                notes: data.specialRequests || '',
                status: data.status || 'pending',
                bookingCode: data.bookingCode || `BOOK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                customerName: data.name || 'Cliente',
                attendance: data.attendance,
                userId: data.userId,
                hasReview: false,
                restaurantImage: data.restaurantImage || '/placeholder.svg',
                email: data.email,
                phone: data.phone
              } as Booking;
            });
          }
          
          setBookings(bookingsFromFirestore);
          checkNewBookings(bookingsFromFirestore);
          checkAttendanceConfirmations(bookingsFromFirestore);
          
        } catch (error) {
          console.error("Error loading bookings from Firestore:", error);
          // Use context bookings as fallback
          const fromContext = contextBookings.filter(booking => booking.restaurantId === restaurantId);
          setBookings(fromContext);
          checkNewBookings(fromContext);
          checkAttendanceConfirmations(fromContext);
        }
      } catch (error) {
        console.error("Error in bookings setup:", error);
        toast.error("Si è verificato un errore nel caricamento delle prenotazioni");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookings();
    
    // Set up a real-time listener for bookings if using Firestore
    try {
      const bookingsCollection = collection(db, "bookings");
      const q = query(bookingsCollection, where("restaurantId", "==", restaurantId));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const bookingsFromFirestore = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Map Firestore data to Booking type with all required fields
          return {
            id: doc.id,
            restaurantId: data.restaurantId,
            restaurantName: data.restaurantName || 'Ristorante',
            date: data.date,
            time: data.time,
            people: data.people || 1,
            notes: data.specialRequests || '',
            status: data.status || 'pending',
            bookingCode: data.bookingCode || `BOOK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            customerName: data.name || 'Cliente',
            attendance: data.attendance,
            userId: data.userId,
            hasReview: false,
            restaurantImage: data.restaurantImage || '/placeholder.svg',
            email: data.email,
            phone: data.phone
          } as Booking;
        });
        
        setBookings(bookingsFromFirestore);
        checkNewBookings(bookingsFromFirestore);
        checkAttendanceConfirmations(bookingsFromFirestore);
      }, (error) => {
        console.error("Error in bookings listener:", error);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Could not set up real-time listener:", error);
      // If real-time fails, fallback to useEffect dependency on contextBookings
    }
  }, [restaurantId, contextBookings]);
  
  const checkNewBookings = (bookingsToCheck: Booking[]) => {
    const pendingBookings = bookingsToCheck.filter(b => b.status === 'pending' && !unreadBookings.includes(b.id));
    
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
  };
  
  // Verifica prenotazioni che necessitano di conferma presenza
  const checkAttendanceConfirmations = (bookingsToCheck: Booking[]) => {
    const needsAttendanceConfirmation = checkAttendanceConfirmationNeeded(bookingsToCheck);
    
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
  
  const updateBookingStatus = async (id: string, updates: Partial<Booking>) => {
    try {
      // Update in context (backwards compatibility)
      updateBooking(id, updates);
      
      // Update in Firestore
      try {
        const bookingRef = doc(db, "bookings", id);
        await updateDoc(bookingRef, {
          ...updates,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error("Error updating booking in Firestore:", error);
        // We already updated in context, so no need to throw
        // This will allow the app to continue working with the context data
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  };
  
  const handleConfirmBooking = async (id: string) => {
    try {
      await updateBookingStatus(id, { status: 'confirmed' });
      toast.success('Prenotazione confermata con successo');
      setUnreadBookings(prev => prev.filter(bookingId => bookingId !== id));
      setNotificationBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      toast.error('Errore durante la conferma della prenotazione');
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await updateBookingStatus(id, { status: 'cancelled' });
      toast.error('Prenotazione cancellata');
      setUnreadBookings(prev => prev.filter(bookingId => bookingId !== id));
      setNotificationBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      toast.error('Errore durante la cancellazione della prenotazione');
    }
  };

  const handleConfirmAttendance = async (id: string) => {
    try {
      const code = generateRestaurantReviewCode(id);
      await updateBookingStatus(id, { attendance: 'confirmed' });
      
      // Save the review code to Firestore
      try {
        const reviewCodesRef = doc(db, "reviewCodes", code);
        await setDoc(reviewCodesRef, {
          bookingId: id,
          restaurantId,
          code,
          used: false,
          createdAt: new Date()
        });
      } catch (error) {
        console.error("Error saving review code to Firestore:", error);
      }
      
      setGeneratedReviewCode(code);
      setCurrentBookingId(id);
      setShowReviewCodeDialog(true);
      
      // Rimuovi dalla lista delle prenotazioni che necessitano di conferma presenza
      setAttendanceBookings(prev => prev.filter(b => b.id !== id));
      
      toast.success('Presenza confermata e codice generato per la recensione');
    } catch (error) {
      toast.error('Errore durante la conferma della presenza');
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await updateBookingStatus(id, { attendance: 'no-show' });
      
      // Rimuovi dalla lista delle prenotazioni che necessitano di conferma presenza
      setAttendanceBookings(prev => prev.filter(b => b.id !== id));
      
      toast.error('Cliente segnato come no-show');
    } catch (error) {
      toast.error('Errore durante la segnalazione di no-show');
    }
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
    isLoading,
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
    allBookings: bookings // For compatibility with the original hook
  };
};
