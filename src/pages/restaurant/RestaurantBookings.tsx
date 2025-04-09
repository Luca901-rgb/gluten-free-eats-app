import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, XCircle, CreditCard, Copy, CheckCheck, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useBookings } from '@/context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
  }, [bookings]);
  
  const handleConfirmBooking = (id: string) => {
    updateBooking(id, { status: 'confirmed' });
    toast.success('Prenotazione confermata con successo');
    setUnreadBookings(prev => prev.filter(bookingId => bookingId !== id));
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
    
    const updatedBooking = allBookings.find(b => b.id === id);
    
    toast.success('Presenza confermata e codice generato per la recensione');
  };

  const handleNoShow = (id: string) => {
    updateBooking(id, { attendance: 'no-show' });
    toast.error('Cliente segnato come no-show');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedReviewCode);
    toast.success('Codice copiato negli appunti');
  };
  
  const redirectToReviews = (bookingCode: string, restaurantCode: string) => {
    setShowReviewCodeDialog(false);
    navigate(`/restaurant/${restaurantId}?tab=reviews&bookingCode=${bookingCode}&restaurantCode=${restaurantCode}`);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confermata</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">In attesa</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancellata</Badge>;
      default:
        return null;
    }
  };

  const getAttendanceBadge = (attendance: string | null) => {
    if (!attendance) return null;
    switch(attendance) {
      case 'confirmed':
        return <Badge className="bg-green-500">Presenza confermata</Badge>;
      case 'no-show':
        return <Badge className="bg-red-500">No-show</Badge>;
      default:
        return null;
    }
  };

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
      
      {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
        <div key={date} className="mb-6">
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          
          <div className="space-y-3">
            {dateBookings.map((booking) => (
              <div 
                key={booking.id} 
                className={cn(
                  "bg-white rounded-lg shadow p-4",
                  unreadBookings.includes(booking.id) && booking.status === 'pending' && "border-2 border-primary"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{booking.customerName}</h3>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {new Date(booking.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {booking.people} {booking.people === 1 ? 'persona' : 'persone'}
                      </div>
                      <div>
                        <span className="text-primary">Codice prenotazione: {booking.bookingCode}</span>
                      </div>
                      {booking.hasGuarantee && (
                        <div className="flex items-center text-green-600">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Carta di garanzia registrata
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    {getStatusBadge(booking.status)}
                    {getAttendanceBadge(booking.attendance)}
                    
                    {booking.restaurantReviewCode && (
                      <div className="text-xs text-green-700 flex items-center">
                        <CheckCheck className="h-3 w-3 mr-1" />
                        Codice recensione generato
                      </div>
                    )}
                  </div>
                </div>
                
                {booking.status === 'pending' && (
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Rifiuta
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleConfirmBooking(booking.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Conferma
                    </Button>
                  </div>
                )}

                {booking.status === 'confirmed' && booking.attendance === null && (
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleNoShow(booking.id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Segna No-Show
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleConfirmAttendance(booking.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Conferma Presenza
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {bookings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nessuna prenotazione disponibile</p>
        </div>
      )}
      
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Nuove prenotazioni in attesa
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {notificationBookings.map(booking => (
                <div key={booking.id} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString('it-IT')} alle{' '}
                        {new Date(booking.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm">{booking.people} {booking.people === 1 ? 'persona' : 'persone'}</p>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => {
                          handleConfirmBooking(booking.id);
                          setNotificationBookings(prev => prev.filter(b => b.id !== booking.id));
                          if (notificationBookings.length === 1) {
                            setShowNotificationDialog(false);
                          }
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Conferma
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNotificationDialog(false)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showReviewCodeDialog} onOpenChange={(open) => {
        if (!open) setShowReviewCodeDialog(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Codice recensione generato</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Questo è il codice che il cliente dovrà inserire per lasciare una recensione verificata:
            </p>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
              <span className="font-mono text-lg font-semibold">{generatedReviewCode}</span>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-1" /> Copia
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Questo codice è stato automaticamente associato alla prenotazione. 
              Quando il cliente accederà alla sezione recensioni del ristorante, 
              potrà utilizzare questo codice che verrà automaticamente inserito nel form.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              const currentBooking = allBookings.find(b => b.id === currentBookingId);
              if (currentBooking) {
                redirectToReviews(currentBooking.bookingCode, generatedReviewCode);
              }
            }}>
              Visualizza in sezione recensioni
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantBookings;
