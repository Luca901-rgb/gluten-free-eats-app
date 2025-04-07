
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, XCircle, CreditCard, Copy, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistance } from 'date-fns';
import { it } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PaymentForm from '@/components/Booking/PaymentForm';
import PaymentManager from '@/components/Payment/PaymentManager';
import { useBookings } from '@/context/BookingContext';

const RestaurantBookings = () => {
  // Set hidePayment to true to disable payment functionality
  const hidePayment = true;
  const { bookings: allBookings, updateBooking, generateRestaurantReviewCode } = useBookings();

  // Filtraggio delle prenotazioni per questo ristorante (simulato con ID '1')
  const restaurantId = '1'; // In un'app reale, questo verrebbe dal contesto dell'autenticazione
  const bookings = allBookings.filter(booking => booking.restaurantId === restaurantId);

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [showReviewCodeDialog, setShowReviewCodeDialog] = useState(false);
  const [generatedReviewCode, setGeneratedReviewCode] = useState<string>('');
  
  const handleConfirmBooking = (id: string) => {
    updateBooking(id, { status: 'confirmed' });
    toast.success('Prenotazione confermata con successo');
  };

  const handleCancelBooking = (id: string) => {
    updateBooking(id, { status: 'cancelled' });
    toast.error('Prenotazione cancellata');
  };

  const handleConfirmAttendance = (id: string) => {
    if (hidePayment) {
      // Generiamo il codice recensione per il ristorante
      const code = generateRestaurantReviewCode(id);
      updateBooking(id, { attendance: 'confirmed' });
      setGeneratedReviewCode(code);
      setCurrentBookingId(id);
      setShowReviewCodeDialog(true);
      return;
    }
    
    setCurrentBookingId(id);
    setShowPaymentDialog(true);
  };

  const handleNoShow = (id: string) => {
    updateBooking(id, { attendance: 'no-show' });
    toast.success('Cliente segnato come no-show. La carta di garanzia verrà addebitata automaticamente.');
  };

  const handlePaymentComplete = (success: boolean) => {
    if (success && currentBookingId) {
      const code = generateRestaurantReviewCode(currentBookingId);
      updateBooking(currentBookingId, { attendance: 'confirmed' });
      setGeneratedReviewCode(code);
      setShowPaymentDialog(false);
      setShowReviewCodeDialog(true);
    } else {
      setShowPaymentDialog(false);
      setCurrentBookingId(null);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedReviewCode);
    toast.success('Codice copiato negli appunti');
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
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Prenotazioni</h1>
        
        {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
          <div key={date} className="mb-6">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {new Date(date).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            
            <div className="space-y-3">
              {dateBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-4">
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
                        {hidePayment ? 'Conferma Presenza' : 'Conferma Presenza e Paga'}
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

        {!hidePayment && (
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pagamento servizio di prenotazione</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <PaymentManager 
                  amount={0.99} 
                  description="Pagamento del servizio di prenotazione. Questo importo verrà addebitato per ogni presenza confermata."
                  isRestaurantPayment={true}
                  onPaymentComplete={handlePaymentComplete}
                  hidePayment={hidePayment}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
        
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
                Il cliente può inserire questo codice nella sezione recensioni per verificare la sua esperienza.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowReviewCodeDialog(false)}>Chiudi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default RestaurantBookings;
